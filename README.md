# 🌾 KhetSetu - Smart Agricultural Platform

![KhetSetu Logo](https://img.shields.io/badge/KhetSetu-Smart%20Agriculture-green?style=for-the-badge&logo=leaf)

**KhetSetu** is a comprehensive Smart Agricultural Platform designed to revolutionize farming through technology. It provides farmers with AI-powered insights, crop management tools, weather monitoring, market linkage, and data-driven decision making capabilities.

## 🚀 Features

### 🌱 **Core Agricultural Features**
- **Farm Management** - Digital farm profiles with location mapping
- **Crop Tracking** - Monitor crop growth stages and health
- **AI-Powered Advice** - Smart recommendations using Gemini AI
- **Weather Integration** - Real-time weather data and forecasts
- **Market Linkage** - Current crop prices and market trends
- **Pest & Disease Detection** - Image-based diagnosis and treatment

### 🛠️ **Technology Stack**
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication with refresh tokens
- **AI Integration**: Google Gemini AI for smart recommendations
- **Deployment**: Production-ready with Docker support

### 🔐 **Authentication System**
- **User Registration** - Multi-step registration with profile setup
- **Secure Login** - JWT-based authentication with automatic token refresh
- **User Profiles** - Comprehensive farmer profiles with location and farm data
- **Password Management** - Secure password reset via email
- **Role-based Access** - Support for farmers, advisors, and administrators
- **Session Management** - Automatic logout and token cleanup

### 📱 **User Experience**
- **Responsive Design** - Works seamlessly on mobile and desktop
- **Dark Mode Support** - Toggle between light and dark themes with system preference detection
- **Multi-language Support** - Hindi and English support
- **Offline Capability** - Core features work without internet
- **Real-time Updates** - Live data synchronization
- **Intuitive Interface** - Farmer-friendly design

## 🏗️ Project Structure

```
KhetSetu/
├── backend/                 # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # MongoDB data models
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Authentication, validation
│   │   ├── config/         # Database, logging configuration
│   │   └── server.ts       # Main server entry point
├── backend/                 # Node.js/Express API Server
│   ├── .env               # Backend environment variables
│   └── package.json       # Backend dependencies
├── frontend/               # React Web Application
│   ├── .env               # Frontend environment variables
│   ├── src/
│   │   ├── components/     # React UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React context providers
│   │   ├── utils/         # Utility functions, API calls
│   │   └── App.tsx        # Main React application
│   └── package.json       # Frontend dependencies
├── docs/                   # Documentation
│   ├── development-guide.md # Development roadmap
│   └── authentication.md  # Authentication system details
└── scripts/               # Utility scripts
    └── simple-test.sh     # API testing script
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/khetsetu.git
cd khetsetu
```

2. **Set up MongoDB Atlas**
- Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free M0 cluster
- Create database user and get connection string

3. **Configure Backend**
```bash
cd backend
npm install
# Create .env file in backend directory with your MongoDB Atlas connection string
```

**Required Environment Variables:**
```env
# MongoDB Atlas Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/khetsetu?retryWrites=true&w=majority

# JWT Authentication (generate secure random strings)
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_minimum_32_characters_long
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173
```

4. **Configure Frontend**
```bash
cd ../frontend
npm install
# .env file is automatically created with default values
```

**Frontend Environment (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start Development Servers**

**Start Servers Separately**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

6. **Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🔐 Authentication System

KhetSetu includes a complete authentication system with user registration, login, profile management, and secure session handling.

### First Time Setup

1. **Start the servers** using the instructions above
2. **Open the frontend** at http://localhost:5173
3. **Register a new account** using the registration form
4. **Complete your profile** with farm details (optional)
5. **Start using the platform** with your authenticated account

### User Registration Process

The registration is a 3-step process:

1. **Basic Information**: Name, email, password, phone (optional)
2. **Location Details**: State, district, village, preferred language
3. **Farm Details**: Farm size, soil type, experience, primary crops (optional)

### Features Included

- ✅ **Secure Registration** with validation
- ✅ **JWT-based Authentication** with automatic token refresh
- ✅ **Password Management** (change password, forgot password)
- ✅ **User Profile Management** with farm details
- ✅ **Multi-language Support** (English/Hindi)
- ✅ **Role-based Access** (farmer, advisor, admin)
- ✅ **Session Persistence** across browser sessions
- ✅ **Automatic Logout** on token expiration

### Testing Authentication

Test the authentication system:

```bash
# Install test dependencies
npm install -g axios colors

# Run authentication tests
node scripts/test-auth-api.js
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Farm Management
- `GET /api/farms` - List user's farms
- `POST /api/farms` - Create new farm
- `GET /api/farms/:id` - Get farm details
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

### Crop Management
- `GET /api/crops` - List crops
- `POST /api/crops` - Add new crop
- `GET /api/crops/:id` - Get crop details
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

### AI & Analytics
- `POST /api/ai/advice` - Get AI farming advice
- `POST /api/ai/disease-detection` - Disease detection from images
- `GET /api/analytics/dashboard` - Dashboard analytics

### External Data
- `GET /api/weather` - Weather information
- `GET /api/market/prices` - Market prices
- `GET /api/health` - System health check

## 🧪 Testing

### Run API Tests
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test all endpoints with provided script
./scripts/simple-test.sh
```

### Test Credentials
- **Email**: `rajesh.farmer@example.com`
- **Password**: `FarmingLife123!`

## 🚀 Deployment

> **⚠️ IMPORTANT**: If you're experiencing double slash issues in URLs (like `https://domain.com//auth/login`), see the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for the complete fix.

### Quick Fix for Vercel Double Slash Issue

If your authentication URLs show double slashes, fix it by:

1. **Go to Vercel Dashboard → Settings → Environment Variables**
2. **Set:** `VITE_API_URL` = `https://khetsetu-backend.onrender.com/api` (NO trailing slash)
3. **Redeploy your frontend**

### Production Environment
```bash
# Build applications
cd backend && npm run build
cd frontend && npm run build

# Start production server
cd backend && npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Detailed Deployment Guide

For complete deployment instructions, troubleshooting, and environment setup, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Environment Variables

**Backend (backend/.env)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/khetsetu-prod?retryWrites=true&w=majority
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
JWT_REFRESH_SECRET=your-secure-refresh-secret-minimum-32-chars
GEMINI_API_KEY=your-gemini-api-key
WEATHER_API_KEY=your-weather-api-key-from-weatherapi.com
```

**Frontend (frontend/.env)**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_WEATHER_API_KEY=your-weather-api-key-from-weatherapi.com
```

### Weather API Setup

The weather functionality uses [WeatherAPI.com](https://www.weatherapi.com/) for real-time weather data:

1. Sign up for a free account at [WeatherAPI.com](https://www.weatherapi.com/)
2. Get your API key from the dashboard
3. Add it to your environment variables as `VITE_WEATHER_API_KEY`
4. The weather widget will automatically use the user's location from their profile
5. Fallback location is set to "Delhi, India" if no user location is available

**Weather Features:**
- Current weather conditions with temperature, humidity, wind speed
- 4-day weather forecast
- Weather alerts and warnings
- Agricultural insights (irrigation recommendations, pest risk assessment)
- UV index monitoring for farm worker safety
```

## 📚 Documentation

- **[Development Guide](docs/development-guide.md)** - Development roadmap
- **[Authentication Guide](docs/authentication.md)** - Authentication system details
- **[API Documentation](http://localhost:5000/api/docs)** - Interactive API docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Ensure mobile responsiveness
- Test with real agricultural data

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run type-check   # TypeScript type checking
npm run lint         # Run ESLint
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation and sanitization
- Environment variable protection

## 🌟 Key Technologies

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 18 | Modern UI framework |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Backend** | Express.js | Web framework |
| **Database** | MongoDB | Document database |
| **Language** | TypeScript | Type safety |
| **AI** | Google Gemini | Smart recommendations |
| **Build** | Vite | Fast build tool |
| **Auth** | JWT | Secure authentication |

## 📱 Mobile Support

KhetSetu is designed mobile-first for farmers in the field:
- Touch-friendly interface
- Offline data synchronization
- Camera integration for crop monitoring
- GPS location tracking
- Progressive Web App (PWA) capabilities

## 🌍 Localization

- **English** - Full support
- **Hindi** - UI and content localization
- **Regional Languages** - Extensible for local dialects

## 📈 Analytics & Monitoring

- User engagement tracking
- Crop performance analytics
- Weather pattern analysis
- Market trend monitoring
- System health monitoring

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/khetsetu/issues)
- **Documentation**: [Project Wiki](https://github.com/yourusername/khetsetu/wiki)
- **Community**: [Discussions](https://github.com/yourusername/khetsetu/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Farmers** - For inspiring this platform
- **Google Gemini AI** - For AI capabilities
- **MongoDB** - For reliable data storage
- **React Team** - For the amazing framework
- **Open Source Community** - For incredible tools and libraries

## 🔮 Roadmap

### Phase 1 (Current) ✅
- Core farm and crop management
- Basic AI recommendations
- User authentication
- Mobile-responsive design

### Phase 2 (Next Quarter)
- IoT sensor integration
- Advanced disease detection
- Market price predictions
- Farmer community features

### Phase 3 (Future)
- Drone integration
- Satellite imagery analysis
- Financial services integration
- Equipment marketplace

---

**Made with ❤️ for farmers by the KhetSetu team**

*Empowering agriculture through technology* 🌾

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Powered by MongoDB](https://img.shields.io/badge/Powered%20by-MongoDB-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![AI by Gemini](https://img.shields.io/badge/AI%20by-Gemini-4285F4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)