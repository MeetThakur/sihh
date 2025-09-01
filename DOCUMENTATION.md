# KhetSetu - Smart Agricultural Platform

## 🌾 Overview

**KhetSetu** is a comprehensive web application designed to empower farmers with AI-driven agricultural guidance, crop management tools, and smart farming solutions. The platform combines modern technology with agricultural expertise to provide personalized recommendations and actionable insights for farmers.

### 🎯 Mission
To bridge the technology gap in agriculture by providing farmers with intelligent, data-driven solutions for crop management, pest control, market insights, and agricultural best practices.

---

## 📱 Core Features

### 1. **Dashboard** 📊
- **Real-time Farm Overview**: Current season tracking (Kharif 2025)
- **Quick Statistics**: Active crops count, pest alerts, and weather updates
- **Recent Activities**: Crop advisory notifications, pest alerts, and system updates
- **Weather Monitoring**: Temperature, humidity, and rainfall data
- **Community Updates**: Farmer network activities and announcements

### 2. **Smart Crop Advisory** 🌱
- **Personalized Crop Recommendations**: AI-powered suggestions based on:
  - Available budget (₹)
  - Seasonal conditions (Kharif/Rabi)
  - Soil type (Loamy, Clay, Sandy, Black Cotton)
  - Weather patterns (Normal, Dry, Wet)
  - Geographic location
  - Farm size (acres)
- **Expected Yield Calculations**: Quintal estimates with ROI projections
- **Detailed Requirements**: Fertilizer, irrigation, and equipment needs
- **Expert Tips**: Best practices and cultivation guidelines
- **Suitability Ratings**: High/Medium/Low recommendations with explanations

### 3. **Interactive Farm Visualization** 🗺️
- **Visual Farm Layout**: Interactive grid-based farm representation
- **Multiple View Modes**:
  - **Crop View**: Visual representation of planted crops with emoji icons
  - **Health Monitoring**: Color-coded plot health status (Excellent/Good/Warning/Poor)
  - **Moisture Tracking**: Soil moisture levels (High/Medium/Low)
- **Plot Management**:
  - Click-to-edit functionality for changing crops
  - Real-time crop suggestions based on soil conditions
  - Drag-and-drop crop planning
- **Smart Recommendations**: AI-powered crop suggestions for each plot
- **Alert System**: Visual indicators for pest alerts and health issues
- **Farm Statistics**: Overall farm health, moisture levels, and active alerts

### 4. **Pest Watch & Management** 🐛
- **Community Pest Reporting**: Real-time pest incident tracking
- **Image-based Pest Detection**: AI-powered pest identification through photo uploads
- **Severity Classifications**: Low/Medium/High risk assessments
- **Location-based Alerts**: GPS-tagged pest reports for nearby farmers
- **Treatment Recommendations**: Targeted pest management solutions
- **Community Network**: Farmer-to-farmer pest reporting and collaboration
- **Historical Data**: Pest pattern analysis and seasonal trends

### 5. **Market Linkage & Pricing** 💰
- **Real-time Market Prices**: Current crop pricing from local mandis
- **Price Trend Analysis**: Historical price patterns and predictions
- **Buyer-Seller Network**: Direct connection with verified buyers
- **Contract Farming**: Secure agreements with agricultural enterprises
- **Price Alerts**: Notification system for favorable market conditions
- **Transportation Assistance**: Logistics support for crop transportation
- **Quality Grading**: Crop quality assessment for better pricing

### 6. **Digital Health Card** 📋
- **Comprehensive Farm Records**: Detailed seasonal performance tracking
- **Multi-season Data**: Kharif and Rabi season comparisons
- **Performance Metrics**:
  - Crops grown with acreage details
  - Total yield in quintals
  - Revenue generation (₹)
  - Soil health assessments
  - Pest incident tracking
  - Risk level evaluations
- **Government Scheme Integration**: 
  - PM-KISAN enrollment status
  - Crop insurance tracking
  - Soil health card linkage
  - Agricultural credit monitoring
- **Expert Recommendations**:
  - Soil improvement suggestions
  - Yield optimization strategies
  - Risk management advice
  - Market linkage opportunities
- **PDF Generation**: Downloadable health cards with html2canvas integration
- **Print & Share**: Easy distribution and record keeping

### 7. **AI-Powered Chatbot** 🤖
- **KhetSetu Agricultural Assistant**: 24/7 intelligent farming support
- **Specialized Knowledge Base**: Trained on agricultural best practices
- **Interactive Chat Interface**: Modern, user-friendly chat widget
- **Pre-built Questions**: Quick access to common farming queries
- **Context-Aware Responses**: Understanding of crop cycles, seasons, and farming practices
- **Multi-language Support**: Regional language assistance (planned)
- **Integration with Platform**: Seamless connection with other app features

---

## 🛠️ Technical Architecture

### **Frontend Stack**
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2 for fast development and optimized builds
- **Styling**: Tailwind CSS 3.4.1 for responsive design
- **Icons**: Lucide React for consistent iconography
- **State Management**: React Hooks (useState, useEffect, useRef)
- **PDF Generation**: html2canvas + jsPDF for document creation

### **AI Integration**
- **Primary AI**: Google Gemini AI (gemini-1.5-flash model)
- **API Management**: Custom serverless proxy for secure API key handling
- **Fallback System**: Multiple API endpoint strategies for reliability
- **Context Optimization**: Agricultural domain-specific prompting

### **Backend Architecture**
- **Serverless Functions**: Vercel-compatible API routes
- **API Proxy**: `/api/gemini.ts` for secure Gemini AI integration
- **Environment Management**: Secure API key storage
- **Error Handling**: Comprehensive fallback mechanisms

### **Development Tools**
- **Package Manager**: npm with ESM modules
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript 5.5.3
- **Build Process**: Vite with React plugin
- **PostCSS**: Autoprefixer integration

### **Deployment**
- **Platform**: Vercel with serverless functions
- **Environment Variables**: 
  - `GEMINI_API_KEY`: Server-side AI API key
  - `VITE_GEMINI_API_KEY`: Client-side fallback key
- **Build Command**: `npm run build`
- **Output**: Static files with serverless API functions

---

## 📊 Data Models & Interfaces

### **Farm Input Interface**
```typescript
interface FarmInput {
  budget: string;          // Available budget in INR
  season: string;          // Kharif/Rabi season
  soilType: string;        // Soil classification
  weather: string;         // Weather conditions
  location: string;        // Geographic location
  farmSize: string;        // Farm area in acres
}
```

### **Crop Recommendation Interface**
```typescript
interface CropRecommendation {
  name: string;                           // Crop name
  suitability: 'High' | 'Medium' | 'Low'; // Recommendation level
  expectedYield: string;                  // Yield estimate in quintals
  roi: string;                           // Return on Investment
  requirements: string[];                 // Input requirements
  tips: string[];                        // Expert cultivation tips
}
```

### **Plot Data Interface**
```typescript
interface PlotData {
  id: string;                                    // Plot identifier
  crop: string;                                  // Current crop
  health: 'excellent' | 'good' | 'warning' | 'poor'; // Health status
  soilMoisture: 'high' | 'medium' | 'low';      // Moisture level
  pestAlert: boolean;                            // Pest alert flag
}
```

### **Season Data Interface**
```typescript
interface SeasonData {
  season: string;                          // Season name
  year: string;                           // Year
  cropsGrown: string[];                   // Crops with acreage
  totalYield: string;                     // Total production
  revenue: string;                        // Revenue in INR
  soilHealth: 'Excellent' | 'Good' | 'Average' | 'Poor';
  pestIncidents: number;                  // Pest attack count
  farmSize: string;                       // Total farm area
  location: string;                       // Farm location
  productivity: number;                   // Productivity percentage
  riskLevel: 'Low' | 'Medium' | 'High';   // Risk assessment
}
```

---

## 🎨 User Interface Design

### **Design Philosophy**
- **Agricultural Theme**: Green color palette representing agriculture
- **Clean & Intuitive**: Farmer-friendly interface with minimal complexity
- **Responsive Design**: Mobile-first approach for field accessibility
- **Visual Hierarchy**: Clear information presentation with proper spacing
- **Accessibility**: High contrast ratios and readable typography

### **Color Scheme**
- **Primary Green**: `#059669` (emerald-600) for main actions
- **Success Green**: `#10B981` (emerald-500) for positive states
- **Warning Amber**: `#F59E0B` (amber-500) for caution alerts
- **Danger Red**: `#EF4444` (red-500) for critical alerts
- **Background**: Gradient from `green-50` to `blue-50`

### **Typography**
- **Primary Font**: System font stack for optimal performance
- **Headings**: Bold weights (font-bold, font-semibold)
- **Body Text**: Regular weight with proper line spacing
- **Small Text**: 12px-14px for secondary information

### **Component Library**
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean input fields with proper labeling
- **Navigation**: Tab-based interface with active states
- **Modals**: Centered overlays with backdrop blur

---

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 18+ with npm
- Git for version control
- Code editor (VS Code recommended)

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/MeetThakur/sihh.git
cd sb1-xl7dtcv6

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY and VITE_GEMINI_API_KEY

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

### **Build for Production**
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### **Deployment to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard:
# GEMINI_API_KEY=your_api_key_here
```

---

## 🌟 Key Innovations

### **1. AI-Powered Agricultural Assistant**
- Custom-trained Gemini AI for agricultural contexts
- Context-aware responses with farming expertise
- Multilingual support for regional farmers

### **2. Interactive Farm Management**
- Visual farm representation with real-time editing
- Drag-and-drop crop planning interface
- Intelligent crop suggestions based on soil conditions

### **3. Community-Driven Pest Management**
- Real-time pest reporting network
- Image-based pest identification
- Location-aware alert system

### **4. Comprehensive Digital Records**
- Multi-season performance tracking
- Government scheme integration
- Exportable digital health cards

### **5. Secure API Architecture**
- Serverless proxy for API key protection
- Multiple fallback mechanisms
- Optimized response caching

---

## 📈 Future Enhancements

### **Phase 2 Features**
- [ ] **IoT Integration**: Soil sensors and weather stations
- [ ] **Drone Monitoring**: Aerial crop health assessment
- [ ] **Blockchain**: Transparent supply chain tracking
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Offline Mode**: Functionality without internet connectivity

### **Phase 3 Features**
- [ ] **Machine Learning**: Advanced predictive analytics
- [ ] **Satellite Imagery**: Remote crop monitoring
- [ ] **Financial Services**: Credit and insurance integration
- [ ] **Government API**: Direct scheme enrollment
- [ ] **Multilingual**: Regional language support

---

## 🤝 Contributing

We welcome contributions from developers, agriculturalists, and domain experts:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Code Standards**
- TypeScript for type safety
- ESLint configuration adherence
- Component-based architecture
- Comprehensive documentation
- Mobile-responsive design

---

## 📞 Support & Contact

- **Email**: support@khetsetu.com
- **GitHub**: [KhetSetu Repository](https://github.com/MeetThakur/sihh)
- **Issues**: Report bugs and feature requests on GitHub Issues
- **Documentation**: Latest docs at `/DOCUMENTATION.md`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Indian Council of Agricultural Research (ICAR)** for agricultural guidance
- **Ministry of Agriculture & Farmers Welfare** for policy insights
- **Google Generative AI** for AI capabilities
- **Open Source Community** for React, Vite, and Tailwind CSS
- **Farmer Communities** for valuable feedback and requirements

---

*KhetSetu - Connecting farmers with technology for a sustainable agricultural future* 🌾
