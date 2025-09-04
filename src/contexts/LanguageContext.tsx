import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.cropAdvisory': { en: 'Crop Advisory', hi: 'फसल सलाह' },
  'nav.farmView': { en: 'Farm View', hi: 'खेत दृश्य' },
  'nav.pestWatch': { en: 'Pest Watch', hi: 'कीट निगरानी' },
  'nav.market': { en: 'Market', hi: 'बाज़ार' },
  'nav.healthCard': { en: 'Health Card', hi: 'स्वास्थ्य कार्ड' },

  // Header
  'header.title': { en: 'KhetSetu', hi: 'खेतसेतु' },
  'header.subtitle': { en: 'Smart Agricultural Platform', hi: 'स्मार्ट कृषि प्लेटफॉर्म' },

  // Dashboard
  'dashboard.currentSeason': { en: 'Current Season', hi: 'वर्तमान मौसम' },
  'dashboard.activeCrops': { en: 'Active Crops', hi: 'सक्रिय फसलें' },
  'dashboard.pestAlerts': { en: 'Pest Alerts', hi: 'कीट चेतावनी' },
  'dashboard.expectedROI': { en: 'Expected ROI', hi: 'अपेक्षित लाभ' },
  'dashboard.recentActivities': { en: 'Recent Activities', hi: 'हाल की गतिविधियां' },
  'dashboard.weatherSoil': { en: 'Weather & Soil', hi: 'मौसम और मिट्टी' },

  // Crop Advisory
  'cropAdvisory.title': { en: 'Farm Information', hi: 'खेती की जानकारी' },
  'cropAdvisory.budget': { en: 'Available Budget (₹)', hi: 'उपलब्ध बजट (₹)' },
  'cropAdvisory.season': { en: 'Season', hi: 'मौसम' },
  'cropAdvisory.soilType': { en: 'Soil Type', hi: 'मिट्टी का प्रकार' },
  'cropAdvisory.weather': { en: 'Weather Conditions', hi: 'मौसम की स्थिति' },
  'cropAdvisory.farmSize': { en: 'Farm Size (acres)', hi: 'खेत का आकार (एकड़)' },
  'cropAdvisory.getAdvice': { en: 'Get AI Crop Advisory', hi: 'AI फसल सलाह प्राप्त करें' },
  'cropAdvisory.generating': { en: 'Generating Recommendations...', hi: 'सुझाव तैयार कर रहे हैं...' },
  'cropAdvisory.recommendations': { en: 'AI Crop Recommendations', hi: 'AI फसल सुझाव' },
  'cropAdvisory.expectedYield': { en: 'Expected Yield:', hi: 'अपेक्षित उत्पादन:' },
  'cropAdvisory.potentialROI': { en: 'Potential ROI:', hi: 'संभावित लाभ:' },
  'cropAdvisory.requirements': { en: 'Requirements:', hi: 'आवश्यकताएं:' },
  'cropAdvisory.expertTips': { en: 'Expert Tips:', hi: 'विशेषज्ञ सुझाव:' },

  // Fasal Calendar
  'fasalCalendar.title': { en: 'Fasal Calendar', hi: 'फसल कैलेंडर' },
  'fasalCalendar.subtitle': { en: 'AI-powered seasonal activity plan', hi: 'AI आधारित मौसमी गतिविधि योजना' },
  'fasalCalendar.viewCalendar': { en: 'View Fasal Calendar', hi: 'फसल कैलेंडर देखें' },
  'fasalCalendar.duration': { en: 'Duration', hi: 'अवधि' },
  'fasalCalendar.totalBudget': { en: 'Total Budget', hi: 'कुल बजट' },
  'fasalCalendar.activities': { en: 'Activities', hi: 'गतिविधियां' },
  'fasalCalendar.weatherAlerts': { en: 'Weather Alerts', hi: 'मौसम चेतावनी' },
  'fasalCalendar.timeline': { en: 'Step-by-Step Timeline', hi: 'चरणबद्ध समयसारणी' },
  'fasalCalendar.weeks': { en: 'weeks', hi: 'सप्ताह' },
  'fasalCalendar.planned': { en: 'planned', hi: 'नियोजित' },

  // Farm Visualization
  'farmViz.title': { en: 'Farm Visualization', hi: 'खेत का चित्रण' },
  'farmViz.farmLayout': { en: 'Farm Layout', hi: 'खेत का लेआउट' },
  'farmViz.legend': { en: 'Legend', hi: 'संकेतक' },
  'farmViz.plotDetails': { en: 'Plot Details', hi: 'प्लॉट विवरण' },
  'farmViz.crop': { en: 'Crop:', hi: 'फसल:' },
  'farmViz.health': { en: 'Health:', hi: 'स्वास्थ्य:' },
  'farmViz.soilMoisture': { en: 'Soil Moisture:', hi: 'मिट्टी की नमी:' },
  'farmViz.pestAlert': { en: 'Pest Alert:', hi: 'कीट चेतावनी:' },
  'farmViz.activeAlert': { en: 'Active Alert', hi: 'सक्रिय चेतावनी' },
  'farmViz.noAlert': { en: 'No Alert', hi: 'कोई चेतावनी नहीं' },
  'farmViz.pestAlertLegend': { en: 'Pest Alert', hi: 'कीट चेतावनी' },
  'farmViz.pestAlertDesc': { en: 'Plots with this symbol require immediate pest management attention', hi: 'इस चिह्न वाले खेतों में तुरंत कीट प्रबंधन की आवश्यकता है' },

  // Seasons
  'season.kharif': { en: 'Kharif (Monsoon)', hi: 'खरीफ (मानसून)' },
  'season.rabi': { en: 'Rabi (Winter)', hi: 'रबी (सर्दी)' },
  'season.zaid': { en: 'Zaid (Summer)', hi: 'जायद (गर्मी)' },

  // Soil Types
  'soil.clay': { en: 'Clay', hi: 'चिकनी मिट्टी' },
  'soil.sandy': { en: 'Sandy', hi: 'रेतीली मिट्टी' },
  'soil.loam': { en: 'Loam', hi: 'दोमट मिट्टी' },
  'soil.silt': { en: 'Silt', hi: 'गाद मिट्टी' },
  'soil.black': { en: 'Black Cotton', hi: 'काली कपास मिट्टी' },
  'soil.red': { en: 'Red', hi: 'लाल मिट्टी' },

  // Weather
  'weather.hotHumid': { en: 'Hot & Humid', hi: 'गर्म और नम' },
  'weather.moderate': { en: 'Moderate', hi: 'सामान्य' },
  'weather.coolDry': { en: 'Cool & Dry', hi: 'ठंडा और शुष्क' },
  'weather.rainy': { en: 'Rainy', hi: 'बरसाती' },

  // Crops
  'crop.rice': { en: 'Rice', hi: 'चावल' },
  'crop.wheat': { en: 'Wheat', hi: 'गेहूं' },
  'crop.sugarcane': { en: 'Sugarcane', hi: 'गन्ना' },
  'crop.maize': { en: 'Maize', hi: 'मक्का' },
  'crop.mustard': { en: 'Mustard', hi: 'सरसों' },
  'crop.potato': { en: 'Potato', hi: 'आलू' },
  'crop.onion': { en: 'Onion', hi: 'प्याज' },
  'crop.tomato': { en: 'Tomato', hi: 'टमाटर' },
  'crop.cotton': { en: 'Cotton', hi: 'कपास' },
  'crop.empty': { en: 'Empty', hi: 'खाली' },

  // Health Status
  'health.excellent': { en: 'Excellent', hi: 'उत्कृष्ट' },
  'health.good': { en: 'Good', hi: 'अच्छा' },
  'health.warning': { en: 'Warning', hi: 'चेतावनी' },
  'health.poor': { en: 'Poor', hi: 'खराब' },

  // Moisture Levels
  'moisture.high': { en: 'High Moisture', hi: 'उच्च नमी' },
  'moisture.medium': { en: 'Medium Moisture', hi: 'मध्यम नमी' },
  'moisture.low': { en: 'Low Moisture', hi: 'कम नमी' },

  // Common Actions
  'action.select': { en: 'Select', hi: 'चुनें' },
  'action.edit': { en: 'Edit', hi: 'संपादित करें' },
  'action.save': { en: 'Save', hi: 'सहेजें' },
  'action.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'action.close': { en: 'Close', hi: 'बंद करें' },
  'action.view': { en: 'View', hi: 'देखें' },

  // Chatbot
  'chatbot.title': { en: 'KhetSetu Assistant', hi: 'खेतसेतु सहायक' },
  'chatbot.status': { en: 'Online • Ready to help', hi: 'ऑनलाइन • सहायता के लिए तैयार' },
  'chatbot.placeholder': { en: 'Ask about farming, crops, or agricultural practices...', hi: 'खेती, फसलों या कृषि प्रथाओं के बारे में पूछें...' },
  'chatbot.send': { en: 'Send', hi: 'भेजें' }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
