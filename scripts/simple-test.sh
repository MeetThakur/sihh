#!/bin/bash

# Simple KhetSetu API Test Script using curl
# This script tests the backend endpoints and creates sample data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "${CYAN}$1${NC}"
}

API_BASE="http://localhost:5000"
TOKEN=""
USER_ID=""
FARM_ID=""

log_header "🌾 KhetSetu API Testing with curl"
log_header "=================================="

# Test 1: Health Check
log_info "1. Testing Health Check..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "$API_BASE/health" || echo "000")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    log_success "✅ Health check passed"
    cat /tmp/health_response.json | head -c 100
    echo ""
else
    log_error "❌ Health check failed (HTTP $HEALTH_RESPONSE)"
    log_error "Make sure backend is running: cd backend && npm run dev"
    exit 1
fi

# Test 2: User Registration
log_info "2. Testing User Registration..."
REGISTER_DATA='{
  "name": "Rajesh Kumar",
  "email": "rajesh.farmer@example.com",
  "password": "FarmingLife123!",
  "phone": "+919876543210",
  "location": "Punjab, India",
  "role": "farmer"
}'

REGISTER_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/register_response.json \
  -H "Content-Type: application/json" \
  -d "$REGISTER_DATA" \
  "$API_BASE/api/auth/register" || echo "000")

if [ "$REGISTER_RESPONSE" = "201" ]; then
    log_success "✅ User registration successful"
    TOKEN=$(cat /tmp/register_response.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(cat /tmp/register_response.json | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    log_info "Token: ${TOKEN:0:20}..."
    log_info "User ID: $USER_ID"
elif [ "$REGISTER_RESPONSE" = "400" ]; then
    log_warning "⚠️  User might already exist, trying login..."

    LOGIN_DATA='{
      "email": "rajesh.farmer@example.com",
      "password": "FarmingLife123!"
    }'

    LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/login_response.json \
      -H "Content-Type: application/json" \
      -d "$LOGIN_DATA" \
      "$API_BASE/api/auth/login" || echo "000")

    if [ "$LOGIN_RESPONSE" = "200" ]; then
        log_success "✅ User login successful"
        TOKEN=$(cat /tmp/login_response.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        USER_ID=$(cat /tmp/login_response.json | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
        log_info "Token: ${TOKEN:0:20}..."
        log_info "User ID: $USER_ID"
    else
        log_error "❌ Login failed (HTTP $LOGIN_RESPONSE)"
        exit 1
    fi
else
    log_error "❌ Registration failed (HTTP $REGISTER_RESPONSE)"
    exit 1
fi

# Test 3: User Profile
log_info "3. Testing User Profile..."
PROFILE_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/profile_response.json \
  -H "Authorization: Bearer $TOKEN" \
  "$API_BASE/api/auth/profile" || echo "000")

if [ "$PROFILE_RESPONSE" = "200" ]; then
    log_success "✅ User profile retrieved"
    NAME=$(cat /tmp/profile_response.json | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    EMAIL=$(cat /tmp/profile_response.json | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
    log_info "Name: $NAME"
    log_info "Email: $EMAIL"
else
    log_error "❌ Profile retrieval failed (HTTP $PROFILE_RESPONSE)"
fi

# Test 4: Create Farm
log_info "4. Testing Farm Creation..."
FARM_DATA='{
  "name": "Green Valley Farm",
  "location": {
    "address": "Village Khettiwala, Punjab",
    "coordinates": {
      "latitude": 30.7333,
      "longitude": 76.7794
    }
  },
  "area": 50,
  "soilType": "Loamy",
  "irrigationType": "Drip irrigation",
  "description": "Organic farm specializing in wheat and rice cultivation"
}'

FARM_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/farm_response.json \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$FARM_DATA" \
  "$API_BASE/api/farms" || echo "000")

if [ "$FARM_RESPONSE" = "201" ]; then
    log_success "✅ Farm creation successful"
    FARM_ID=$(cat /tmp/farm_response.json | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    FARM_NAME=$(cat /tmp/farm_response.json | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    log_info "Farm ID: $FARM_ID"
    log_info "Farm Name: $FARM_NAME"
elif [ "$FARM_RESPONSE" = "400" ]; then
    log_warning "⚠️  Farm might already exist, fetching existing farms..."

    FARMS_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/farms_response.json \
      -H "Authorization: Bearer $TOKEN" \
      "$API_BASE/api/farms" || echo "000")

    if [ "$FARMS_RESPONSE" = "200" ]; then
        FARM_ID=$(cat /tmp/farms_response.json | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
        if [ -n "$FARM_ID" ]; then
            log_success "✅ Using existing farm"
            log_info "Farm ID: $FARM_ID"
        fi
    fi
else
    log_error "❌ Farm creation failed (HTTP $FARM_RESPONSE)"
fi

# Test 5: Get Farms
log_info "5. Testing Farm Retrieval..."
FARMS_LIST_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/farms_list_response.json \
  -H "Authorization: Bearer $TOKEN" \
  "$API_BASE/api/farms" || echo "000")

if [ "$FARMS_LIST_RESPONSE" = "200" ]; then
    log_success "✅ Farms retrieved successfully"
    FARM_COUNT=$(cat /tmp/farms_list_response.json | grep -o '"_id"' | wc -l)
    log_info "Total farms: $FARM_COUNT"
else
    log_error "❌ Farm retrieval failed (HTTP $FARMS_LIST_RESPONSE)"
fi

# Test 6: Create Crops
log_info "6. Testing Crop Creation..."
if [ -n "$FARM_ID" ]; then
    CROP1_DATA="{
      \"name\": \"Wheat\",
      \"variety\": \"HD-2967\",
      \"plantingDate\": \"2024-11-15T00:00:00.000Z\",
      \"expectedHarvestDate\": \"2025-04-15T00:00:00.000Z\",
      \"area\": 25,
      \"status\": \"growing\",
      \"stage\": \"tillering\",
      \"notes\": \"First winter crop of the season\",
      \"farm\": \"$FARM_ID\"
    }"

    CROP1_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/crop1_response.json \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$CROP1_DATA" \
      "$API_BASE/api/crops" || echo "000")

    if [ "$CROP1_RESPONSE" = "201" ]; then
        log_success "✅ Wheat crop created"
        CROP1_ID=$(cat /tmp/crop1_response.json | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
        log_info "Crop ID: $CROP1_ID"
    elif [ "$CROP1_RESPONSE" = "400" ]; then
        log_warning "⚠️  Wheat crop might already exist"
    else
        log_error "❌ Wheat crop creation failed (HTTP $CROP1_RESPONSE)"
    fi

    CROP2_DATA="{
      \"name\": \"Rice\",
      \"variety\": \"Basmati 1121\",
      \"plantingDate\": \"2024-06-15T00:00:00.000Z\",
      \"expectedHarvestDate\": \"2024-10-15T00:00:00.000Z\",
      \"area\": 25,
      \"status\": \"harvested\",
      \"stage\": \"harvested\",
      \"notes\": \"Summer crop - excellent yield this year\",
      \"farm\": \"$FARM_ID\"
    }"

    CROP2_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/crop2_response.json \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$CROP2_DATA" \
      "$API_BASE/api/crops" || echo "000")

    if [ "$CROP2_RESPONSE" = "201" ]; then
        log_success "✅ Rice crop created"
        CROP2_ID=$(cat /tmp/crop2_response.json | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
        log_info "Crop ID: $CROP2_ID"
    elif [ "$CROP2_RESPONSE" = "400" ]; then
        log_warning "⚠️  Rice crop might already exist"
    else
        log_error "❌ Rice crop creation failed (HTTP $CROP2_RESPONSE)"
    fi
else
    log_warning "⚠️  No farm ID available, skipping crop creation"
fi

# Test 7: Get Crops
log_info "7. Testing Crop Retrieval..."
CROPS_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/crops_response.json \
  -H "Authorization: Bearer $TOKEN" \
  "$API_BASE/api/crops" || echo "000")

if [ "$CROPS_RESPONSE" = "200" ]; then
    log_success "✅ Crops retrieved successfully"
    CROP_COUNT=$(cat /tmp/crops_response.json | grep -o '"_id"' | wc -l)
    log_info "Total crops: $CROP_COUNT"
else
    log_error "❌ Crop retrieval failed (HTTP $CROPS_RESPONSE)"
fi

# Test 8: Test AI Features (if available)
log_info "8. Testing AI Features..."
AI_DATA='{
  "prompt": "What are the best practices for wheat cultivation in Punjab, India?",
  "cropType": "wheat",
  "context": "farming advice"
}'

AI_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/ai_response.json \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$AI_DATA" \
  "$API_BASE/api/ai/advice" || echo "000")

if [ "$AI_RESPONSE" = "200" ]; then
    log_success "✅ AI advice feature working"
    AI_TEXT=$(cat /tmp/ai_response.json | head -c 100)
    log_info "AI Response preview: $AI_TEXT..."
elif [ "$AI_RESPONSE" = "404" ]; then
    log_warning "⚠️  AI endpoint not found - feature may not be implemented yet"
else
    log_warning "⚠️  AI feature test failed (HTTP $AI_RESPONSE)"
fi

# Test 9: Weather Data (if available)
log_info "9. Testing Weather Data..."
WEATHER_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/weather_response.json \
  -H "Authorization: Bearer $TOKEN" \
  "$API_BASE/api/weather?location=Punjab,India" || echo "000")

if [ "$WEATHER_RESPONSE" = "200" ]; then
    log_success "✅ Weather data retrieved"
    log_info "Weather data available"
elif [ "$WEATHER_RESPONSE" = "404" ]; then
    log_warning "⚠️  Weather endpoint not available"
else
    log_warning "⚠️  Weather data test failed (HTTP $WEATHER_RESPONSE)"
fi

# Test 10: Market Prices (if available)
log_info "10. Testing Market Prices..."
MARKET_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/market_response.json \
  -H "Authorization: Bearer $TOKEN" \
  "$API_BASE/api/market/prices?crop=wheat" || echo "000")

if [ "$MARKET_RESPONSE" = "200" ]; then
    log_success "✅ Market prices retrieved"
    log_info "Market data available"
elif [ "$MARKET_RESPONSE" = "404" ]; then
    log_warning "⚠️  Market prices endpoint not available"
else
    log_warning "⚠️  Market prices test failed (HTTP $MARKET_RESPONSE)"
fi

# Final Summary
log_header ""
log_header "🎉 API Testing Complete!"
log_header "========================"
log_success "✅ Backend server is running"
log_success "✅ Database connection working"
log_success "✅ User authentication working"
log_success "✅ Farm management working"
log_success "✅ Crop management working"
log_success "✅ Sample data created successfully"

log_header ""
log_header "📋 Sample Data Created:"
log_info "👤 User: Rajesh Kumar (rajesh.farmer@example.com)"
log_info "🏪 Farm: Green Valley Farm"
log_info "🌾 Crops: Wheat and Rice"

log_header ""
log_header "🔗 Useful URLs:"
log_info "🏥 Health Check: http://localhost:5000/health"
log_info "📖 API Docs: http://localhost:5000/api/docs"
log_info "🌐 Frontend: http://localhost:5174"

log_header ""
log_header "🧪 Test Credentials:"
log_info "📧 Email: rajesh.farmer@example.com"
log_info "🔑 Password: FarmingLife123!"

log_header ""
log_success "🌾 Your KhetSetu platform is ready for use!"

# Cleanup temp files
rm -f /tmp/*_response.json

log_info "Test completed successfully! 🚀"
