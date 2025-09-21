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
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
├── frontend/               # React Web Application
│   ├── src/
│   │   ├── components/     # React UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React context providers
│   │   ├── utils/         # Utility functions, API calls
│   │   └── App.tsx        # Main React application
│   └── package.json       # Frontend dependencies
├── docs/                   # Documentation
│   ├── README.md          # Documentation index
│   ├── development-guide.md # Development roadmap
│   └── mongodb-atlas-setup.md # Cloud database setup
└── scripts/               # Utility scripts
    ├── README.md          # Scripts documentation
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

2. **Set up MongoDB** (choose one option)
```bash
# Option A: Local MongoDB
./scripts/install-mongodb.sh

# Option B: MongoDB Atlas (cloud)
# Follow docs/MONGODB_ATLAS_SETUP.md guide
```

3. **Configure Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
```

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/khetsetu

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
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

**Option A: Start Both Servers at Once**
```bash
# From project root
./scripts/start-dev.sh
```

**Option B: Start Servers Separately**
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
# Test all endpoints
./scripts/simple-test.sh

# Manual testing with curl
curl http://localhost:5000/health
```

### Test Credentials
- **Email**: `rajesh.farmer@example.com`
- **Password**: `FarmingLife123!`

## 🚀 Deployment

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

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/khetsetu
JWT_SECRET=your-secure-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
```

**Frontend (.env.local)**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your-gemini-api-key
```

## 📚 Documentation

- **[Documentation Hub](docs/README.md)** - Complete documentation index
- **[Development Guide](docs/development-guide.md)** - Development roadmap
- **[MongoDB Atlas Setup](docs/mongodb-atlas-setup.md)** - Cloud database setup
- **[Scripts Documentation](scripts/README.md)** - Utility scripts guide
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