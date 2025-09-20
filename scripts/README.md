# 🛠️ KhetSetu Scripts

This directory contains utility scripts for setting up, testing, and maintaining the KhetSetu Smart Agricultural Platform.

## 📋 Available Scripts

### 🧪 Testing Scripts

#### `simple-test.sh`
**Purpose**: Comprehensive API testing using curl commands

**Usage**:
```bash
./scripts/simple-test.sh
```

**Features**:
- Tests all major API endpoints
- Creates sample user, farm, and crop data
- Validates authentication flow
- Checks database connectivity
- Provides detailed success/failure reports

**Prerequisites**:
- Backend server running on port 5000
- MongoDB running and accessible
- curl installed

**Output**: Colored terminal output with test results and sample data creation

---

## 🗄️ Database Setup Scripts

### MongoDB Installation (Manual Creation Needed)

If you need to recreate the MongoDB installation script, create `install-mongodb.sh` with:

```bash
#!/bin/bash
# MongoDB 7.0 installation for Ubuntu/Debian systems
# Add MongoDB GPG key and repository
# Install MongoDB Community Edition
# Configure for development use
```

### MongoDB Testing

Use the `simple-test.sh` script to test MongoDB connectivity and API functionality.

---

## 🚀 Development Scripts

### Quick Start
```bash
# Start both backend and frontend
cd scripts
./start-dev.sh  # Create this script if needed
```

### Testing Workflow
```bash
# 1. Start backend
cd backend && npm run dev

# 2. Wait for startup, then test
cd scripts && ./simple-test.sh

# 3. Start frontend
cd frontend && npm run dev
```

---

## 📝 Creating New Scripts

### Script Template
```bash
#!/bin/bash
# Script: script-name.sh
# Purpose: Brief description
# Author: Your Name
# Date: YYYY-MM-DD

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Your script logic here
main() {
    log_info "Starting script..."
    # Implementation
    log_success "Script completed successfully!"
}

# Run main function
main "$@"
```

### Make Scripts Executable
```bash
chmod +x scripts/your-script.sh
```

---

## 🔧 Utility Scripts Ideas

### Development Helpers
- `start-dev.sh` - Start both frontend and backend
- `reset-db.sh` - Reset database with fresh sample data
- `check-deps.sh` - Verify all dependencies are installed
- `update-deps.sh` - Update all npm dependencies

### Testing Scripts
- `test-api.sh` - API endpoint testing (current: `simple-test.sh`)
- `test-frontend.sh` - Frontend component testing
- `test-e2e.sh` - End-to-end testing
- `load-test.sh` - Performance testing

### Deployment Scripts
- `build-all.sh` - Build both frontend and backend
- `deploy-staging.sh` - Deploy to staging environment
- `deploy-prod.sh` - Deploy to production
- `backup-db.sh` - Create database backup

### Maintenance Scripts
- `cleanup-logs.sh` - Clean old log files
- `health-check.sh` - System health monitoring
- `update-env.sh` - Update environment configurations

---

## 📊 Script Usage Analytics

### Current Scripts Performance
- ✅ `simple-test.sh` - Comprehensive API testing
- 📝 Additional scripts can be added as needed

### Recommended Next Scripts
1. **start-dev.sh** - Quick development startup
2. **reset-db.sh** - Database reset with sample data
3. **build-all.sh** - Complete build process

---

## 🤝 Contributing Scripts

### Guidelines
1. **Clear Purpose**: Each script should have a single, clear purpose
2. **Error Handling**: Use `set -e` and proper error checking
3. **Logging**: Use colored output functions for clarity
4. **Documentation**: Include header comments and usage examples
5. **Testing**: Test scripts thoroughly before committing

### Pull Request Process
1. Create script with proper permissions (`chmod +x`)
2. Test script in clean environment
3. Update this README with script documentation
4. Submit PR with clear description

---

## 🔒 Security Notes

- **Never commit sensitive data** (passwords, API keys) in scripts
- **Use environment variables** for configuration
- **Validate inputs** before processing
- **Log security-relevant actions** appropriately

---

## 📞 Support

If you need help with scripts:
1. Check this README first
2. Review the script's header comments
3. Run script with `--help` flag (if implemented)
4. Create an issue in the GitHub repository

---

**Last Updated**: September 2025  
**Scripts Version**: 1.0.0