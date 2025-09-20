# 🌾 KhetSetu Backend API

A comprehensive Node.js backend API for the KhetSetu Smart Agricultural Platform, providing AI-powered farming solutions, crop advisory services, and farm management capabilities.

## 🚀 Features

- **Authentication & Authorization** - JWT-based secure authentication
- **AI Integration** - Google Gemini AI for crop advisory and pest identification
- **Farm Management** - Complete farm and plot management system
- **Real-time Weather Data** - Weather integration for farming decisions
- **Market Intelligence** - Crop price tracking and market insights
- **Multilingual Support** - English and Hindi language support
- **Comprehensive Logging** - Structured logging with Winston
- **Health Monitoring** - Detailed health checks and system metrics
- **Rate Limiting** - Protection against abuse and DDoS
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Centralized error management

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **AI Service**: Google Gemini AI
- **Validation**: Express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting
- **Language**: TypeScript
- **Development**: ts-node-dev, nodemon

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18.0.0 or higher
- MongoDB 5.0 or higher (local or MongoDB Atlas)
- Google Gemini AI API key
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd khetsetu/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/khetsetu
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # AI Services
   GEMINI_API_KEY=your-gemini-api-key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 Quick Start

### Development Server
```bash
npm run dev
```
Server will start on `http://localhost:5000`

### Production Build
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   │   ├── database.ts    # MongoDB connection
│   │   └── logger.ts      # Winston logger setup
│   ├── controllers/    # Route controllers
│   │   ├── authController.ts
│   │   ├── aiController.ts
│   │   └── ...
│   ├── middleware/     # Custom middleware
│   │   ├── auth.ts        # Authentication middleware
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── models/         # Mongoose models
│   │   ├── User.ts
│   │   ├── Farm.ts
│   │   ├── CropAdvisory.ts
│   │   └── ...
│   ├── routes/         # Express routes
│   │   ├── authRoutes.ts
│   │   ├── aiRoutes.ts
│   │   └── ...
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   └── server.ts       # Main server file
├── dist/              # Compiled JavaScript (generated)
├── logs/              # Log files (generated)
├── .env.example       # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/khetsetu` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `GEMINI_API_KEY` | Google Gemini AI API key | `your-gemini-key` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000,http://localhost:5173` |
| `LOG_LEVEL` | Logging level | `info` |
| `WEATHER_API_KEY` | Weather service API key | - |
| `MARKET_API_KEY` | Market data API key | - |

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

### Farm Management
- `GET /api/farms` - Get user's farms
- `POST /api/farms` - Create new farm
- `GET /api/farms/:id` - Get farm details
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm
- `POST /api/farms/:id/plots` - Add plot to farm
- `PUT /api/farms/:id/plots/:plotNumber` - Update plot

### AI Services
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/crop-advice` - Get crop recommendations
- `POST /api/ai/pest-identification` - Identify pests/diseases
- `POST /api/ai/soil-analysis` - Analyze soil data
- `GET /api/ai/status` - Get AI service status

### Crop Advisory
- `POST /api/crop-advisory/recommendations` - Get crop recommendations
- `GET /api/crop-advisory/history` - Get advisory history
- `GET /api/crop-advisory/:id` - Get specific advisory
- `POST /api/crop-advisory/:id/feedback` - Submit feedback

### Weather
- `GET /api/weather/current` - Current weather
- `GET /api/weather/forecast` - Weather forecast
- `GET /api/weather/alerts` - Weather alerts

### Market Data
- `GET /api/market/prices` - Crop prices
- `GET /api/market/trends` - Market trends
- `GET /api/market/demand-forecast` - Demand forecast

### Health Checks
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system health
- `GET /api/health/database` - Database health
- `GET /api/health/ai` - AI service health

## 📊 Database Schema

### User Model
```typescript
{
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'farmer' | 'advisor' | 'admin';
  profile: {
    farmSize?: number;
    location?: LocationData;
    soilType?: string;
    // ... more fields
  };
  // ... other fields
}
```

### Farm Model
```typescript
{
  owner: ObjectId;
  name: string;
  totalSize: number;
  location: LocationData;
  soilType: string;
  plots: PlotData[];
  // ... other fields
}
```

### CropAdvisory Model
```typescript
{
  user: ObjectId;
  requestDetails: RequestData;
  recommendations: RecommendationData[];
  aiResponse: AIResponseData;
  // ... other fields
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs with salt rounds
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Configurable cross-origin resource sharing
- **Security Headers** - Helmet.js security headers
- **SQL Injection Protection** - MongoDB injection prevention
- **XSS Protection** - Input sanitization

## 📝 Logging

The application uses Winston for structured logging:

- **Log Levels**: error, warn, info, http, debug
- **Log Files**: 
  - `logs/error.log` - Error logs only
  - `logs/all.log` - All log levels
  - `logs/exceptions.log` - Uncaught exceptions
- **Console Output**: Colorized logs in development

## 🚦 Error Handling

Centralized error handling with custom error classes:
- `AppError` - Generic application errors
- `ValidationError` - Input validation errors
- `AuthenticationError` - Authentication failures
- `AuthorizationError` - Permission errors
- `NotFoundError` - Resource not found
- `ConflictError` - Resource conflicts

## 🔄 Development Workflow

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Make changes** - Server automatically restarts

3. **Check logs** - Monitor console or log files

4. **Test endpoints** - Use Postman or similar tools

5. **Lint code**
   ```bash
   npm run lint
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Setup
1. Set production environment variables
2. Configure MongoDB connection
3. Set up reverse proxy (nginx)
4. Configure SSL certificates
5. Set up monitoring and logging

### Health Checks
The API provides multiple health check endpoints for monitoring:
- `/health` - Basic health status
- `/api/health/detailed` - Comprehensive system check
- `/api/health/live` - Liveness probe for Kubernetes
- `/api/health/ready` - Readiness probe for Kubernetes

## 🐛 Debugging

### Development Debugging
```bash
# Enable debug logs
NODE_ENV=development LOG_LEVEL=debug npm run dev
```

### Production Debugging
```bash
# View error logs
tail -f logs/error.log

# View all logs
tail -f logs/all.log
```

## 📈 Performance Optimization

- **Database Indexing** - Optimized MongoDB indexes
- **Caching** - Redis caching for frequent queries
- **Compression** - Gzip compression for responses
- **Rate Limiting** - Prevent API abuse
- **Connection Pooling** - MongoDB connection pooling
- **Async Operations** - Non-blocking I/O operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint configuration
- Write comprehensive tests
- Document API changes
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@khetsetu.com
- Documentation: [API Docs](http://localhost:5000/api/docs)
- Health Status: [Health Check](http://localhost:5000/api/health)

## 🔗 Related Links

- [Frontend Repository](../README.md)
- [API Documentation](http://localhost:5000/api/docs)
- [Health Dashboard](http://localhost:5000/api/health/detailed)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Google Gemini AI](https://ai.google.dev/)

---

**Built with ❤️ for farmers by the KhetSetu Team**