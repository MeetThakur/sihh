# 🌾 KhetSetu - Smart Agricultural Platform

KhetSetu is a comprehensive AI-powered agricultural platform designed to empower farmers with smart decision-making tools, real-time insights, and expert guidance for improved crop management and farming practices.

## 🚀 Features

### 🌱 **Crop Advisory System**

- **AI-Powered Recommendations**: Get personalized crop suggestions based on:
  - Available budget
  - Seasonal conditions
  - Soil type analysis
  - Weather patterns
  - Farm size optimization
- **Smart Input Forms**: Streamlined data collection with validation
- **ROI Calculations**: Expected yield and return on investment predictions

### 📅 **Fasal Calendar (Smart Crop Calendar)**

- **AI-Generated Timeline**: Week-by-week activity planning from sowing to harvest
- **Weather-Aware Scheduling**: Automatic adjustments based on weather predictions
- **Budget-Friendly Alternatives**: Cost-effective suggestions for resource-constrained farmers
- **Activity Tracking**: Mark completed tasks and maintain farming records
- **Integrated Notifications**: Reminders for critical farming activities
- **Visual Icons**: Easy-to-understand symbols (🌱 seed, 💧 water, 🐛 pest, 🌾 harvest)

### 🗺️ **Farm Visualization**

- **Interactive Farm Layout**: Visual representation of farm plots (up to 36 plots)
- **Multi-View Modes**:
  - **Crops View**: Color-coded crop distribution
  - **Health Monitoring**: Soil and crop health status
  - **Moisture Levels**: Irrigation planning insights
- **Plot Management**:
  - Click-to-edit crop selection
  - Real-time plot status updates
  - Crop rotation suggestions
- **Enhanced Pest Alerts**:
  - Prominent visual warnings with animations
  - Urgent action recommendations
  - Neighboring plot contamination prevention

### 🐛 **Pest Watch**

- **Early Warning System**: Pest detection and alerts
- **Treatment Recommendations**: Organic and chemical solutions
- **Preventive Measures**: Proactive pest management strategies

### 📈 **Market Linkage**

- **Price Tracking**: Real-time market prices
- **Selling Opportunities**: Connect with buyers
- **Market Trends**: Historical and predictive pricing data

### 🏥 **Digital Health Card**

- **Farm Health Reports**: Comprehensive farm status documentation
- **Activity Logging**: Automatic recording of farming activities
- **PDF Generation**: Downloadable reports for record-keeping
- **Performance Analytics**: Track farming success over time

### 💬 **AI Chatbot Assistant**

- **24/7 Agricultural Support**: Expert guidance anytime
- **Multi-language Support**: English and Hindi (हिंदी) interface
- **Context-Aware Responses**: KhetSetu platform integration
- **Quick Suggestions**: Pre-loaded common farming questions

### 🌍 **Language Support**

- **Bilingual Interface**: Seamless switching between English and Hindi
- **Localized Content**: All features available in both languages
- **Cultural Adaptation**: Region-specific farming practices

### 📊 **Dashboard**

- **Real-time Metrics**: Active crops, pest alerts, ROI tracking
- **Recent Activities**: Timeline of farming operations
- **Weather Integration**: Current conditions and forecasts
- **Quick Actions**: One-click access to key features

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (Fast development and optimized builds)
- **Styling**: Tailwind CSS (Utility-first CSS framework)
- **Icons**: Lucide React (Beautiful, customizable icons)
- **State Management**: React Hooks (useState, useContext)
- **Routing**: Single Page Application (SPA) with component-based navigation

### **AI Integration**

- **AI Service**: Google Gemini AI (gemini-1.5-flash model)
- **API Management**: Custom proxy for secure key handling
- **Context Awareness**: Agricultural-specific prompt engineering

### **Backend/API**

- **Serverless Functions**: Vercel serverless functions
- **API Proxy**: Secure Gemini API integration
- **Environment Management**: Secure API key handling

### **Additional Libraries**

- **PDF Generation**: jsPDF + html2canvas for health card exports
- **Language Management**: Custom React Context for i18n
- **Animations**: CSS animations with Tailwind classes
- **Responsive Design**: Mobile-first responsive layout

### **Development Tools**

- **TypeScript**: Type safety and better development experience
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing and optimization
- **Git**: Version control and collaboration

## 📱 User Interface

### **Design Principles**

- **Farmer-Friendly**: Simple, intuitive interface designed for users with varying technical literacy
- **Visual Clarity**: Color-coded systems and clear iconography
- **Mobile-First**: Responsive design optimized for mobile devices
- **Accessibility**: High contrast alerts and clear visual indicators

### **Navigation**

- **Single Page Application**: Fast, seamless navigation between features
- **Breadcrumb System**: Clear indication of current location
- **Quick Actions**: Easy access to frequently used features

## 🌟 Key Highlights

### **Smart Decision Making**

- AI-powered recommendations based on real-time data
- Evidence-based farming suggestions
- Cost-benefit analysis for every recommendation

### **Visual Farm Management**

- Interactive plot visualization with real-time status updates
- Color-coded health monitoring system
- Animated pest alerts for immediate attention

### **Comprehensive Planning**

- 16-week detailed farming calendar
- Weather-dependent activity scheduling
- Budget optimization with alternative suggestions

### **Record Keeping**

- Automatic activity logging
- Digital health card generation
- Exportable PDF reports for official use

### **Accessibility**

- Bilingual support (English/Hindi)
- Simple visual indicators
- Mobile-optimized interface

## 🎯 Target Users

- **Small-scale Farmers**: 1-5 acre farm owners
- **Medium-scale Farmers**: 5-20 acre farm management
- **Agricultural Advisors**: Extension officers and consultants
- **New Farmers**: First-time farming entrepreneurs
- **Traditional Farmers**: Looking to adopt modern techniques

## 🌍 Impact

### **Productivity Enhancement**

- Optimized crop selection based on scientific analysis
- Reduced crop failure through early warning systems
- Improved yield through proper timing and resource management

### **Cost Optimization**

- Budget-aware recommendations
- Reduced wastage through precision farming
- Alternative solution suggestions for cost-effectiveness

### **Knowledge Democratization**

- AI-powered expert knowledge accessible to all farmers
- Multilingual support breaking language barriers
- Simple interface overcoming digital literacy challenges

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

### **Installation**

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd sb1-xl7dtcv6

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY and VITE_GEMINI_API_KEY

# Start development server
npm run dev
```

### **Environment Variables**

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### **Build for Production**

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
src/
├── components/           # React components
│   ├── CropAdvisory.tsx     # AI-powered crop recommendations
│   ├── FarmVisualization.tsx # Interactive farm plots
│   ├── Dashboard.tsx        # Main dashboard
│   ├── Chatbot.tsx         # AI assistant
│   ├── HealthCard.tsx      # Digital health reports
│   ├── PestWatch.tsx       # Pest monitoring
│   ├── MarketLinkage.tsx   # Market integration
│   └── Navigation.tsx      # App navigation
├── contexts/            # React contexts
│   └── LanguageContext.tsx # i18n management
├── utils/              # Utility functions
│   ├── aiService.ts        # AI integration
│   ├── geminiService.ts    # Gemini API calls
│   └── mockData.ts         # Sample data
└── types/              # TypeScript definitions
    └── index.ts            # Type definitions
```

## 🤝 Contributing

We welcome contributions to make KhetSetu even better! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Areas for Contribution**

- Additional language support
- New crop varieties and recommendations
- Enhanced AI prompts and responses
- Mobile app development
- API integrations with weather services
- Advanced analytics and reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for providing advanced AI capabilities
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons
- **Vite** for fast development experience
- **Agricultural Experts** who provided domain knowledge
- **Farming Community** for feedback and insights

## 📞 Support

For support, email support@khetsetu.com or join our community discussions.

## 🗺️ Roadmap

### **Phase 1** (Current)

- ✅ Core crop advisory system
- ✅ Farm visualization
- ✅ AI chatbot integration
- ✅ Bilingual support

### **Phase 2** (Upcoming)

- 🔄 Weather API integration
- 🔄 Government scheme integration
- 🔄 Mobile application
- 🔄 Offline mode support

### **Phase 3** (Future)

- 📋 IoT sensor integration
- 📋 Drone mapping support
- 📋 Marketplace integration
- 📋 Community features

---

<div align="center">

**Built with ❤️ for farmers by the KhetSetu team**

[🌐 Visit KhetSetu](https://khetsetu.vercel.app) | [📧 Contact Us](mailto:support@khetsetu.com) | [🐛 Report Issues](https://github.com/MeetThakur/khetsetu/issues)

</div>
