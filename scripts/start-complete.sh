#!/bin/bash

# KhetSetu Complete Startup Script
# This script checks MongoDB, starts backend and frontend servers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script configuration
MONGODB_PORT=27017
BACKEND_PORT=5000
FRONTEND_PORT=5173
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${GREEN}🌾 KhetSetu Complete Startup Script${NC}"
echo -e "${BLUE}====================================${NC}\n"

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2

    if check_port $port; then
        echo -e "${GREEN}✅ $service_name is running on port $port${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $service_name is not running on port $port${NC}"
        return 1
    fi
}

# Function to wait for service to start
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    echo -e "${CYAN}🔄 Waiting for $service_name to start on port $port...${NC}"

    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            echo -e "${GREEN}✅ $service_name is now running on port $port${NC}"
            return 0
        fi

        echo -e "${YELLOW}   Attempt $attempt/$max_attempts - waiting...${NC}"
        sleep 2
        ((attempt++))
    done

    echo -e "${RED}❌ $service_name failed to start on port $port after $max_attempts attempts${NC}"
    return 1
}

# Function to check MongoDB
check_mongodb() {
    echo -e "\n${BLUE}🍃 Checking MongoDB...${NC}"

    # Check if MongoDB process is running
    if pgrep mongod > /dev/null; then
        echo -e "${GREEN}✅ MongoDB process is running${NC}"

        # Check if MongoDB is responding
        if mongosh --eval "db.runCommand({ping: 1})" --quiet > /dev/null 2>&1; then
            echo -e "${GREEN}✅ MongoDB is responding to connections${NC}"

            # Check KhetSetu database
            local db_exists=$(mongosh khetsetu --eval "db.stats().ok" --quiet 2>/dev/null || echo "0")
            if [ "$db_exists" = "1" ]; then
                local user_count=$(mongosh khetsetu --eval "db.users.countDocuments()" --quiet 2>/dev/null || echo "0")
                echo -e "${GREEN}✅ KhetSetu database exists with $user_count users${NC}"
            else
                echo -e "${YELLOW}⚠️  KhetSetu database will be created on first use${NC}"
            fi
            return 0
        else
            echo -e "${RED}❌ MongoDB is not responding${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  MongoDB is not running${NC}"
        return 1
    fi
}

# Function to start MongoDB
start_mongodb() {
    echo -e "\n${CYAN}🚀 Starting MongoDB...${NC}"

    # Try different methods to start MongoDB
    if command -v systemctl &> /dev/null; then
        echo -e "${CYAN}   Using systemctl to start MongoDB...${NC}"
        sudo systemctl start mongod
        sleep 3
    elif command -v brew &> /dev/null && brew services list | grep mongodb-community > /dev/null; then
        echo -e "${CYAN}   Using brew to start MongoDB...${NC}"
        brew services start mongodb-community
        sleep 3
    elif command -v mongod &> /dev/null; then
        echo -e "${CYAN}   Starting MongoDB directly...${NC}"
        mongod --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --fork
        sleep 3
    else
        echo -e "${RED}❌ Could not find a way to start MongoDB${NC}"
        echo -e "${YELLOW}   Please start MongoDB manually:${NC}"
        echo -e "${YELLOW}   - Ubuntu/Debian: sudo systemctl start mongod${NC}"
        echo -e "${YELLOW}   - macOS: brew services start mongodb-community${NC}"
        echo -e "${YELLOW}   - Manual: mongod --dbpath /path/to/data${NC}"
        return 1
    fi

    # Verify MongoDB started
    if check_mongodb; then
        echo -e "${GREEN}✅ MongoDB started successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to start MongoDB${NC}"
        return 1
    fi
}

# Function to check Node.js and npm
check_node() {
    echo -e "\n${BLUE}📦 Checking Node.js and npm...${NC}"

    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        echo -e "${YELLOW}   Please install Node.js from https://nodejs.org/${NC}"
        return 1
    fi

    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        echo -e "${YELLOW}   Please install npm${NC}"
        return 1
    fi

    local node_version=$(node --version)
    local npm_version=$(npm --version)
    echo -e "${GREEN}✅ Node.js $node_version and npm $npm_version are installed${NC}"
    return 0
}

# Function to install dependencies
install_dependencies() {
    echo -e "\n${BLUE}📦 Checking and installing dependencies...${NC}"

    # Backend dependencies
    if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
        echo -e "${CYAN}   Installing backend dependencies...${NC}"
        cd "$PROJECT_ROOT/backend"
        npm install
    else
        echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
    fi

    # Frontend dependencies
    if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
        echo -e "${CYAN}   Installing frontend dependencies...${NC}"
        cd "$PROJECT_ROOT/frontend"
        npm install
    else
        echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
    fi

    cd "$PROJECT_ROOT"
}

# Function to setup environment files
setup_env_files() {
    echo -e "\n${BLUE}🔧 Checking environment configuration...${NC}"

    # Backend .env
    if [ ! -f "$PROJECT_ROOT/backend/.env" ]; then
        echo -e "${CYAN}   Creating backend .env file...${NC}"
        cat > "$PROJECT_ROOT/backend/.env" << 'EOF'
# Environment
NODE_ENV=development

# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/khetsetu

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production_$(date +%s)
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production_$(date +%s)
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Optional - for development)
EMAIL_FROM=noreply@khetsetu.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Weather API (Optional)
WEATHER_API_KEY=your_openweather_api_key

# Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_api_key
EOF
        echo -e "${GREEN}✅ Backend .env file created${NC}"
    else
        echo -e "${GREEN}✅ Backend .env file exists${NC}"
    fi

    # Frontend .env
    if [ ! -f "$PROJECT_ROOT/frontend/.env" ]; then
        echo -e "${CYAN}   Creating frontend .env file...${NC}"
        cat > "$PROJECT_ROOT/frontend/.env" << 'EOF'
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=KhetSetu
VITE_APP_VERSION=1.0.0

# Development flags
VITE_DEV_MODE=true
EOF
        echo -e "${GREEN}✅ Frontend .env file created${NC}"
    else
        echo -e "${GREEN}✅ Frontend .env file exists${NC}"
    fi
}

# Function to start backend
start_backend() {
    echo -e "\n${BLUE}🚀 Starting Backend Server...${NC}"

    if check_service "Backend" $BACKEND_PORT; then
        echo -e "${YELLOW}   Backend is already running${NC}"
        return 0
    fi

    cd "$PROJECT_ROOT/backend"
    echo -e "${CYAN}   Starting backend server on port $BACKEND_PORT...${NC}"
    npm run dev > ../logs/backend.log 2>&1 &

    cd "$PROJECT_ROOT"

    if wait_for_service "Backend" $BACKEND_PORT; then
        echo -e "${GREEN}✅ Backend server started successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend server failed to start${NC}"
        echo -e "${YELLOW}   Check logs/backend.log for details${NC}"
        return 1
    fi
}

# Function to start frontend
start_frontend() {
    echo -e "\n${BLUE}🚀 Starting Frontend Server...${NC}"

    if check_service "Frontend" $FRONTEND_PORT; then
        echo -e "${YELLOW}   Frontend is already running${NC}"
        return 0
    fi

    cd "$PROJECT_ROOT/frontend"
    echo -e "${CYAN}   Starting frontend server on port $FRONTEND_PORT...${NC}"
    npm run dev > ../logs/frontend.log 2>&1 &

    cd "$PROJECT_ROOT"

    if wait_for_service "Frontend" $FRONTEND_PORT; then
        echo -e "${GREEN}✅ Frontend server started successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Frontend server failed to start${NC}"
        echo -e "${YELLOW}   Check logs/frontend.log for details${NC}"
        return 1
    fi
}

# Function to test services
test_services() {
    echo -e "\n${BLUE}🧪 Testing Services...${NC}"

    # Test backend health
    if curl -s http://localhost:$BACKEND_PORT/health > /dev/null; then
        echo -e "${GREEN}✅ Backend health check passed${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
    fi

    # Test frontend
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null; then
        echo -e "${GREEN}✅ Frontend accessibility check passed${NC}"
    else
        echo -e "${RED}❌ Frontend accessibility check failed${NC}"
    fi

    # Test CORS
    if curl -s -H "Origin: http://localhost:$FRONTEND_PORT" http://localhost:$BACKEND_PORT/api/auth/profile -X OPTIONS > /dev/null; then
        echo -e "${GREEN}✅ CORS configuration working${NC}"
    else
        echo -e "${YELLOW}⚠️  CORS test failed (this might be expected)${NC}"
    fi
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"

    # Kill background processes
    jobs -p | xargs -r kill 2>/dev/null

    # Kill any remaining processes on our ports
    if check_port $BACKEND_PORT; then
        echo -e "${CYAN}   Stopping backend server...${NC}"
        lsof -ti:$BACKEND_PORT | xargs -r kill
    fi

    if check_port $FRONTEND_PORT; then
        echo -e "${CYAN}   Stopping frontend server...${NC}"
        lsof -ti:$FRONTEND_PORT | xargs -r kill
    fi

    echo -e "${GREEN}✅ Cleanup completed${NC}"
    exit 0
}

# Main execution
main() {
    # Create logs directory
    mkdir -p "$PROJECT_ROOT/logs"

    # Set trap for cleanup
    trap cleanup SIGINT SIGTERM

    echo -e "${PURPLE}🔍 Checking prerequisites...${NC}"

    # Step 1: Check Node.js and npm
    if ! check_node; then
        exit 1
    fi

    # Step 2: Check and start MongoDB
    if ! check_mongodb; then
        echo -e "${CYAN}   Attempting to start MongoDB...${NC}"
        if ! start_mongodb; then
            echo -e "${RED}❌ Could not start MongoDB. Please start it manually.${NC}"
            exit 1
        fi
    fi

    # Step 3: Setup environment files
    setup_env_files

    # Step 4: Install dependencies
    install_dependencies

    # Step 5: Start backend
    if ! start_backend; then
        echo -e "${RED}❌ Failed to start backend server${NC}"
        exit 1
    fi

    # Step 6: Start frontend
    if ! start_frontend; then
        echo -e "${RED}❌ Failed to start frontend server${NC}"
        exit 1
    fi

    # Step 7: Test services
    sleep 3
    test_services

    # Success message
    echo -e "\n${GREEN}🎉 KhetSetu is now running successfully!${NC}"
    echo -e "${BLUE}==========================================${NC}"
    echo -e "${GREEN}📊 Backend:${NC}      http://localhost:$BACKEND_PORT"
    echo -e "${GREEN}🌐 Frontend:${NC}     http://localhost:$FRONTEND_PORT"
    echo -e "${GREEN}🏥 Health Check:${NC} http://localhost:$BACKEND_PORT/health"
    echo -e "${GREEN}📚 API Docs:${NC}     http://localhost:$BACKEND_PORT/api/docs"
    echo -e "\n${PURPLE}🍃 Database:${NC}     MongoDB running on localhost:$MONGODB_PORT"
    echo -e "${PURPLE}📝 Logs:${NC}         Check logs/backend.log and logs/frontend.log"
    echo -e "\n${YELLOW}💡 Tips:${NC}"
    echo -e "   • Press ${RED}Ctrl+C${NC} to stop all services"
    echo -e "   • Register at: http://localhost:$FRONTEND_PORT"
    echo -e "   • API test page: http://localhost:8080/test-frontend-connection.html"
    echo -e "   • MongoDB data: /var/lib/mongodb (Ubuntu) or /usr/local/var/mongodb (macOS)"
    echo -e "\n${BLUE}==========================================${NC}"

    # Keep script running and wait for processes
    echo -e "${CYAN}🔄 Monitoring services... Press Ctrl+C to stop${NC}"

    while true; do
        # Check if services are still running every 30 seconds
        sleep 30

        if ! check_port $BACKEND_PORT; then
            echo -e "${RED}⚠️  Backend server stopped unexpectedly${NC}"
            break
        fi

        if ! check_port $FRONTEND_PORT; then
            echo -e "${RED}⚠️  Frontend server stopped unexpectedly${NC}"
            break
        fi
    done
}

# Run main function
main "$@"
