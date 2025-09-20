# 📚 KhetSetu Documentation

Welcome to the KhetSetu Smart Agricultural Platform documentation. This directory contains comprehensive guides and references for developers, administrators, and users.

## 📋 Documentation Index

### 🚀 Getting Started
- **[Main README](../README.md)** - Project overview and quick start guide
- **[MongoDB Atlas Setup](mongodb-atlas-setup.md)** - Cloud database setup guide
- **[Development Guide](development-guide.md)** - Comprehensive development roadmap

### 🛠️ Development
- **API Documentation** - Available at `http://localhost:5000/api/docs` when running
- **[Frontend Components](../frontend/src/components/)** - React component documentation
- **[Backend API](../backend/src/)** - Server-side architecture and endpoints

### 🔧 Scripts & Tools
- **[Scripts Directory](../scripts/)** - Installation and utility scripts
  - `install-mongodb.sh` - Local MongoDB installation
  - `simple-test.sh` - API testing script
  - `cleanup-install.sh` - Environment cleanup

### 🏗️ Architecture

```
KhetSetu Platform Architecture

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │   MongoDB Atlas  │
│   (Port 5173)   │◄──►│   (Port 5000)   │◄──►│    Database     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          │                       │                       │
    ┌─────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐
    │Tailwind CSS│          │ Gemini AI   │         │  Collections │
    │   Vite     │          │ Integration │         │  - users     │
    │TypeScript  │          │ JWT Auth    │         │  - farms     │
    └────────────┘          │ Validation  │         │  - crops     │
                           └─────────────┘         └─────────────┘
```

### 🔐 Security
- **Authentication**: JWT-based with bcrypt password hashing
- **Authorization**: Role-based access control
- **Data Protection**: Input validation and sanitization
- **CORS**: Configured for frontend-backend communication

### 🧪 Testing
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full application workflow testing
- **Performance Tests**: Load and stress testing

### 📱 Mobile Support
- **Responsive Design**: Mobile-first approach
- **Progressive Web App**: Offline capabilities
- **Touch Interface**: Farmer-friendly mobile experience

### 🌐 Deployment
- **Development**: Local development with hot reload
- **Staging**: Testing environment setup
- **Production**: Optimized builds and deployment
- **Docker**: Containerized deployment options

### 🔍 Monitoring
- **Health Checks**: System status monitoring
- **Logging**: Comprehensive application logging
- **Analytics**: User engagement and performance metrics
- **Error Tracking**: Production error monitoring

## 🤝 Contributing

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive JSDoc comments
- Follow conventional commit messages

### Documentation Guidelines
- Keep documentation up-to-date with code changes
- Use clear, concise language
- Include code examples where relevant
- Test all code examples before publishing

### Submitting Changes
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update relevant documentation
5. Submit a pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/khetsetu/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/khetsetu/discussions)
- **Email**: support@khetsetu.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Last Updated**: September 2025
**Documentation Version**: 1.0.0
**Platform Version**: 1.0.0