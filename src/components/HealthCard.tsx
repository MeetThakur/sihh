import React, { useState, useRef } from 'react';
import { FileText, Download, Calendar, TrendingUp, AlertTriangle, Award, User, MapPin, Phone, Mail, Leaf, Star, Shield, DollarSign, ChevronDown, Printer, Share2, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SeasonData {
  season: string;
  year: string;
  cropsGrown: string[];
  totalYield: string;
  revenue: string;
  soilHealth: 'Excellent' | 'Good' | 'Average' | 'Poor';
  pestIncidents: number;
  farmSize: string;
  location: string;
  productivity: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface FarmerInfo {
  name: string;
  farmerId: string;
  phone: string;
  email: string;
  location: string;
  farmSize: string;
  photo?: string;
}

interface Scheme {
  name: string;
  status: 'eligible' | 'enrolled' | 'pending' | 'completed';
  amount?: string;
}

const HealthCard: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('kharif-2024');
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mock farmer data
  const farmerInfo: FarmerInfo = {
    name: 'Rajesh Kumar Singh',
    farmerId: 'FRM-HR-2024-001234',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@farmer.gov.in',
    location: 'Village Khetri, Tehsil Bahadurgarh, District Jhajjar, Haryana - 124507',
    farmSize: '5.5 Acres'
  };

  // Government schemes data
  const schemes: Scheme[] = [
    { name: 'PM-KISAN', status: 'enrolled', amount: '₹6,000/year' },
    { name: 'Crop Insurance (PMFBY)', status: 'eligible', amount: '₹1,50,000 coverage' },
    { name: 'KCC Loan', status: 'pending', amount: '₹3,00,000 limit' },
    { name: 'Soil Health Card', status: 'completed' },
    { name: 'DBT Fertilizer Subsidy', status: 'enrolled', amount: '₹2,500 saved' }
  ];

  // Enhanced seasonal data
  const seasonalData: { [key: string]: SeasonData } = {
    'kharif-2024': {
      season: 'Kharif',
      year: '2024',
      cropsGrown: ['Basmati Rice (3.5 Acres)', 'Cotton (1.5 Acres)', 'Sugarcane (0.5 Acres)'],
      totalYield: '65.2 quintals',
      revenue: '₹1,85,750',
      soilHealth: 'Good',
      pestIncidents: 2,
      farmSize: '5.5 Acres',
      location: 'Haryana',
      productivity: 85,
      riskLevel: 'Medium'
    },
    'rabi-2023': {
      season: 'Rabi',
      year: '2023-24',
      cropsGrown: ['Wheat (4.0 Acres)', 'Mustard (1.0 Acres)', 'Barley (0.5 Acres)'],
      totalYield: '48.8 quintals',
      revenue: '₹1,42,400',
      soilHealth: 'Excellent',
      pestIncidents: 1,
      farmSize: '5.5 Acres',
      location: 'Haryana',
      productivity: 92,
      riskLevel: 'Low'
    },
    'kharif-2023': {
      season: 'Kharif',
      year: '2023',
      cropsGrown: ['Basmati Rice (3.0 Acres)', 'Cotton (2.0 Acres)', 'Maize (0.5 Acres)'],
      totalYield: '58.3 quintals',
      revenue: '₹1,65,200',
      soilHealth: 'Good',
      pestIncidents: 4,
      farmSize: '5.5 Acres',
      location: 'Haryana',
      productivity: 78,
      riskLevel: 'High'
    }
  };

  const currentData = seasonalData[selectedSeason];

  const downloadHealthCard = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      // Configure html2canvas for better PDF quality
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: cardRef.current.scrollWidth,
        height: cardRef.current.scrollHeight,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`Farm-Health-Card-${farmerInfo.farmerId}-${selectedSeason}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Good': return 'text-green-600 bg-green-50 border-green-200';
      case 'Average': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSchemeStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'eligible': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSchemeIcon = (status: string) => {
    switch (status) {
      case 'enrolled': return <CheckCircle size={16} />;
      case 'eligible': return <Star size={16} />;
      case 'pending': return <Calendar size={16} />;
      case 'completed': return <Award size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-4 sm:p-6">
      {/* Header with Controls */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FileText size={28} className="text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">Digital Farm Health Card</h1>
                  <p className="text-green-100 text-sm">Government of India • Ministry of Agriculture</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="appearance-none px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent pr-8"
                  >
                    <option value="kharif-2024" className="text-gray-900">Kharif 2024</option>
                    <option value="rabi-2023" className="text-gray-900">Rabi 2023-24</option>
                    <option value="kharif-2023" className="text-gray-900">Kharif 2023</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                </div>
                
                <button
                  onClick={downloadHealthCard}
                  disabled={isDownloading}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-emerald-600 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Health Card */}
      <div className="max-w-4xl mx-auto">
        <div ref={cardRef} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header - Government Seal */}
          <div className="bg-gradient-to-r from-orange-500 to-green-500 h-2"></div>
          <div className="text-center py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">भारत सरकार • GOVERNMENT OF INDIA</h2>
            <p className="text-sm text-gray-600">कृषि एवं किसान कल्याण मंत्रालय • Ministry of Agriculture & Farmers Welfare</p>
            <p className="text-xs text-gray-500 mt-1">डिजिटल फार्म हेल्थ कार्ड • Digital Farm Health Card</p>
          </div>

          {/* Farmer Profile */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 flex justify-center lg:justify-start">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <User size={36} className="text-white" />
                </div>
              </div>
              
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{farmerInfo.name}</h3>
                  <div className="flex items-center space-x-2 text-emerald-600 font-medium">
                    <span className="text-sm bg-emerald-100 px-2 py-1 rounded">ID: {farmerInfo.farmerId}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone size={14} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{farmerInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={14} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{farmerInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{farmerInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Leaf size={14} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">Farm Size: {farmerInfo.farmSize}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Season Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Season Summary - {currentData.season} {currentData.year}</h4>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-emerald-500" />
                <span className="text-sm text-gray-600">Updated: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <Leaf className="text-green-600" size={20} />
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">CROPS</span>
                </div>
                <div className="space-y-1">
                  {currentData.cropsGrown.map((crop, index) => (
                    <p key={index} className="text-xs text-gray-700 leading-relaxed">{crop}</p>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="text-blue-600" size={20} />
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">YIELD</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{currentData.totalYield}</p>
                <p className="text-xs text-gray-600">Productivity: {currentData.productivity}%</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="text-amber-600" size={20} />
                  <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded">REVENUE</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{currentData.revenue}</p>
                <p className="text-xs text-gray-600">Per Acre: ₹{Math.round(parseFloat(currentData.revenue.replace(/[₹,]/g, '')) / parseFloat(currentData.farmSize)).toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="text-purple-600" size={20} />
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">HEALTH</span>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getHealthColor(currentData.soilHealth)}`}>
                  {currentData.soilHealth}
                </div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getRiskColor(currentData.riskLevel)}`}>
                  Risk: {currentData.riskLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Government Schemes */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2 text-emerald-500" size={20} />
              Government Scheme Status
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schemes.map((scheme, index) => (
                <div key={index} className={`p-4 rounded-xl border ${getSchemeStatusColor(scheme.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getSchemeIcon(scheme.status)}
                      <span className="text-sm font-medium">{scheme.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getSchemeStatusColor(scheme.status)}`}>
                      {scheme.status.toUpperCase()}
                    </span>
                  </div>
                  {scheme.amount && (
                    <p className="text-xs text-gray-600 mt-1">{scheme.amount}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Star className="mr-2 text-amber-500" size={20} />
              AI-Powered Recommendations
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                <h5 className="font-semibold text-emerald-900 mb-2 flex items-center text-sm">
                  <Leaf className="mr-2" size={14} />
                  Soil Enhancement
                </h5>
                <p className="text-emerald-800 text-xs leading-relaxed">
                  Consider adding organic compost and implementing crop rotation with legumes to improve soil nitrogen content and overall health.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-xl border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center text-sm">
                  <TrendingUp className="mr-2" size={14} />
                  Yield Optimization
                </h5>
                <p className="text-blue-800 text-xs leading-relaxed">
                  Install drip irrigation system to increase water efficiency by 40% and boost crop yield in the upcoming season.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <h5 className="font-semibold text-amber-900 mb-2 flex items-center text-sm">
                  <AlertTriangle className="mr-2" size={14} />
                  Risk Management
                </h5>
                <p className="text-amber-800 text-xs leading-relaxed">
                  Implement integrated pest management and consider weather-based insurance to mitigate risks from climate variations.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
                <h5 className="font-semibold text-purple-900 mb-2 flex items-center text-sm">
                  <DollarSign className="mr-2" size={14} />
                  Market Linkage
                </h5>
                <p className="text-purple-800 text-xs leading-relaxed">
                  Connect with FPOs and use e-NAM portal for better price realization. Current market rates are favorable for your crops.
                </p>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Shield size={14} className="text-emerald-500" />
                <span>Digitally Verified • AgriTech India Platform</span>
              </div>
              <div>
                Generated: {new Date().toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div>
                Valid Until: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-gray-500">
              This is a computer-generated document. No signature required.
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons (Outside the card for cleaner PDF) */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-center space-x-4">
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Printer size={16} />
          <span>Print</span>
        </button>
        
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Farm Health Card',
                text: `Farm Health Card for ${farmerInfo.name} - ${currentData.season} ${currentData.year}`,
                url: window.location.href
              });
            } else {
              // Fallback for browsers that don't support Web Share API
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default HealthCard;