# Authentication System Documentation

## Overview

KhetSetu implements a comprehensive authentication system with JWT-based authentication, user registration, login, password management, and user profile management. The system is built with security best practices and provides a smooth user experience.

## Architecture

### Backend Components

- **Models**: `User.ts` - Mongoose schema with comprehensive user profile structure
- **Controllers**: `authController.ts` - Handles all authentication operations
- **Middleware**: `auth.ts` - JWT token verification and user authentication
- **Routes**: `authRoutes.ts` - RESTful API endpoints with validation
- **Validation**: Express-validator for input sanitization and validation

### Frontend Components

- **AuthContext**: React context for global authentication state management
- **API Service**: Centralized service for all API calls with token management
- **Components**:
  - `Login.tsx` - User login form with validation
  - `Register.tsx` - Multi-step user registration
  - `ForgotPassword.tsx` - Password reset functionality
  - `AuthWrapper.tsx` - Authentication flow controller
  - `UserProfile.tsx` - User profile management

## Authentication Flow

### 1. User Registration

```
User → Registration Form → API Service → Backend Validation → Database → JWT Tokens → Auto Login
```

**Features:**
- Multi-step registration process (Basic Info → Location → Farm Details)
- Comprehensive form validation
- Password strength requirements
- Role-based registration (farmer, advisor, admin)
- Automatic login after successful registration

**API Endpoint:** `POST /api/auth/register`

### 2. User Login

```
User → Login Form → API Service → Backend Authentication → JWT Tokens → Dashboard
```

**Features:**
- Email/password authentication
- Remember me functionality via refresh tokens
- Automatic token refresh
- Session persistence
- Error handling with user-friendly messages

**API Endpoint:** `POST /api/auth/login`

### 3. Token Management

**Access Token:**
- Short-lived (7 days default)
- Contains user information
- Required for protected routes
- Automatically included in API requests

**Refresh Token:**
- Long-lived (30 days default)
- Used to refresh access tokens
- Stored securely in localStorage
- Automatic refresh on token expiration

### 4. Password Reset

```
User → Forgot Password → Email Verification → Reset Token → New Password
```

**Features:**
- Email-based password reset
- Secure token generation
- Token expiration (10 minutes)
- Password strength validation

## User Profile Structure

```typescript
interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: "farmer" | "advisor" | "admin";
  profile: {
    farmSize?: number;
    location?: {
      state: string;
      district: string;
      village?: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    soilType?: "clay" | "sandy" | "loamy" | "silt" | "peat" | "chalk";
    farmingExperience?: number;
    primaryCrops?: string[];
    preferredLanguage: "en" | "hi";
    avatar?: string;
  };
  subscription?: {
    plan: "free" | "basic" | "premium";
    expiresAt?: string;
    features: string[];
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      weatherAlerts: boolean;
      pestAlerts: boolean;
      marketUpdates: boolean;
    };
    units: {
      area: "acres" | "hectares";
      temperature: "celsius" | "fahrenheit";
      currency: "INR" | "USD";
    };
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  // ... additional fields
}
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| POST | `/api/auth/logout-all` | Logout from all devices | Yes |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| GET | `/api/auth/verify-email/:token` | Verify email address | No |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/deactivate` | Deactivate account | Yes |

## Frontend Usage

### Using AuthContext

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { state, login, logout, register } = useAuth();

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (!state.isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {state.user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import ApiService from '../services/api';

// API service automatically handles authentication
const response = await ApiService.getProfile();
if (response.success) {
  console.log('User profile:', response.data.user);
}
```

### Protected Routes

```tsx
function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        {/* Your protected app content */}
        <Dashboard />
      </AuthWrapper>
    </AuthProvider>
  );
}
```

## Security Features

### Backend Security

1. **Password Hashing**: bcrypt with salt rounds (12)
2. **JWT Security**: Signed tokens with secure secrets
3. **Input Validation**: Comprehensive validation using express-validator
4. **Rate Limiting**: Protection against brute force attacks
5. **CORS Configuration**: Controlled cross-origin requests
6. **Helmet.js**: Security headers
7. **Password Requirements**: Strong password enforcement
8. **Token Expiration**: Automatic token expiry

### Frontend Security

1. **Token Storage**: Secure localStorage usage
2. **Automatic Logout**: On token expiration
3. **Input Sanitization**: Form validation and sanitization
4. **Error Handling**: Secure error messages
5. **Session Management**: Proper session cleanup

## Error Handling

### Backend Error Responses

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Frontend Error Handling

- User-friendly error messages
- Form validation feedback
- Network error handling
- Token expiration handling
- Automatic retry for failed requests

## Environment Configuration

### Backend (backend/.env)

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Database
MONGODB_URI=mongodb://localhost:27017/khetsetu

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## Testing

### Backend Testing

```bash
# Run authentication tests
npm test -- --grep "Auth"

# Test specific endpoints
npm run test:auth
```

### Frontend Testing

```bash
# Run authentication component tests
npm test -- auth

# Run E2E authentication tests
npm run test:e2e:auth
```

## Deployment Considerations

### Production Settings

1. **Environment Variables**: Secure secret management
2. **HTTPS**: Enforce SSL/TLS
3. **Token Security**: Shorter token expiry in production
4. **Rate Limiting**: Stricter limits
5. **Logging**: Comprehensive audit logging
6. **Monitoring**: Authentication failure monitoring

### Database Security

1. **Connection Security**: Encrypted connections
2. **User Permissions**: Minimal required permissions
3. **Backup**: Regular automated backups
4. **Indexing**: Optimized queries for auth operations

## Common Issues & Solutions

### Issue: Token Expiration

**Problem**: User gets logged out unexpectedly
**Solution**: Automatic token refresh is implemented

### Issue: Registration Validation

**Problem**: Complex validation errors
**Solution**: Step-by-step validation with clear error messages

### Issue: Password Reset

**Problem**: Email delivery issues
**Solution**: Fallback mechanisms and clear user guidance

### Issue: Cross-Origin Requests

**Problem**: CORS errors in development
**Solution**: Proper CORS configuration in backend

## Development Workflow

### Adding New Authentication Features

1. Update backend models/controllers
2. Add API endpoints with validation
3. Update frontend API service
4. Create/update UI components
5. Add to AuthContext if needed
6. Write tests
7. Update documentation

### Testing Authentication

1. Unit tests for individual functions
2. Integration tests for API endpoints
3. E2E tests for complete user flows
4. Security testing for vulnerabilities

## Best Practices

### Backend

- Always validate and sanitize input
- Use middleware for common operations
- Implement proper error handling
- Log authentication events
- Regular security audits

### Frontend

- Use TypeScript for type safety
- Implement proper loading states
- Handle all error scenarios
- Provide clear user feedback
- Secure token storage

### General

- Regular dependency updates
- Security vulnerability scanning
- Code reviews for auth changes
- Documentation updates
- User feedback integration