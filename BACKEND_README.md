# KhetSetu Backend API

A comprehensive backend system for KhetSetu agricultural management platform with authentication and data storage capabilities.

## Features

- **User Authentication**: JWT-based registration, login, and profile management
- **Farm Management**: CRUD operations for farm data with location and soil type tracking
- **Crop Management**: Comprehensive crop lifecycle tracking with expenses and revenue
- **Security**: Rate limiting, input validation, password hashing, and CORS protection
- **Data Analytics**: Dashboard with statistics, crop analytics, and financial tracking

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/khetsetu
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRES_IN=7d
   
   # Client Configuration
   CLIENT_URL=http://localhost:5173
   ```

3. **Start MongoDB**:
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

4. **Run the application**:
   ```bash
   # Development mode (frontend + backend)
   npm run dev:full
   
   # Backend only
   npm run server:dev
   
   # Frontend only
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (authenticated)
- `PUT /profile` - Update user profile (authenticated)
- `PUT /change-password` - Change password (authenticated)
- `GET /verify` - Verify JWT token
- `POST /logout` - Logout user

### Farm Routes (`/api/farm`)

- `GET /` - Get all user farms (authenticated)
- `GET /:id` - Get specific farm (authenticated)
- `POST /` - Create new farm (authenticated)
- `PUT /:id` - Update farm (authenticated)
- `DELETE /:id` - Delete farm (authenticated)
- `GET /:id/crops` - Get farm crops (authenticated)
- `POST /:id/crops` - Add crop to farm (authenticated)

### User Routes (`/api/user`)

- `GET /dashboard` - Get dashboard data (authenticated)
- `GET /crops` - Get user crops with pagination (authenticated)
- `GET /crops/:id` - Get specific crop (authenticated)
- `PUT /crops/:id` - Update crop (authenticated)
- `DELETE /crops/:id` - Delete crop (authenticated)
- `POST /crops/:id/expenses` - Add expense to crop (authenticated)
- `PUT /crops/:id/stage` - Update crop stage (authenticated)

### Health Check

- `GET /api/health` - Server health status

## Data Models

### User Model
- Personal information (name, email, phone)
- Location details
- Authentication credentials
- Preferences and settings
- Associated farms

### Farm Model
- Farm details (name, area, soil type)
- Location with coordinates
- Irrigation and water sources
- Facilities and certifications
- Associated crops

### Crop Model
- Crop information (name, variety, category)
- Planting and harvest dates
- Growth stages tracking
- Financial tracking (expenses, revenue)
- Health status and treatments
- Notes and images

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: express-validator for all endpoints
- **CORS Protection**: Configured for frontend origin
- **Helmet**: Security headers protection
- **Data Sanitization**: Mongoose validation and sanitization

## Database Design

- **MongoDB** with Mongoose ODM
- **Indexes** for performance optimization
- **Data Relationships** between User, Farm, and Crop models
- **Validation** at schema level
- **Virtual Fields** for calculated values

## Error Handling

- Structured error responses
- Development vs production error details
- Validation error formatting
- Async error catching
- 404 handling for undefined routes

## Development

### Scripts Available

- `npm run dev:full` - Run both frontend and backend in development mode
- `npm run server:dev` - Run backend with nodemon (auto-restart)
- `npm run server` - Run backend in production mode
- `npm run dev` - Run frontend only
- `npm run build` - Build frontend for production
- `npm start` - Production mode (build + serve)

### API Testing

Use tools like Postman or curl to test the API:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Farmer","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get profile (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Production Deployment

1. **Environment Variables**: Set production values in `.env`
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **Security**: Generate strong JWT secret
4. **Build**: Run `npm run build` for frontend
5. **Start**: Use `npm start` or process manager like PM2

## License

This project is part of the KhetSetu agricultural management platform.