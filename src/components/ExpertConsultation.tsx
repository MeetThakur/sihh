import React, { useState } from 'react';
import { Users, Star, MessageCircle, Phone, Video, Calendar, User, Badge, Award, Send } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  totalConsultations: number;
  languages: string[];
  availability: 'available' | 'busy' | 'offline';
  pricePerSession: number;
  imageUrl?: string;
  qualifications: string[];
  description: string;
}

interface ConsultationRequest {
  expertId: string;
  type: 'chat' | 'voice' | 'video';
  description: string;
  preferredTime?: string;
  urgency: 'low' | 'medium' | 'high';
}

const ExpertConsultation: React.FC = () => {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [consultationRequest, setConsultationRequest] = useState<ConsultationRequest>({
    expertId: '',
    type: 'chat',
    description: '',
    urgency: 'medium'
  });

  // Mock expert data
  const experts: Expert[] = [
    {
      id: '1',
      name: 'Dr. Ramesh Kumar',
      specialty: 'Crop Disease Management',
      experience: 15,
      rating: 4.8,
      totalConsultations: 1250,
      languages: ['Hindi', 'English', 'Punjabi'],
      availability: 'available',
      pricePerSession: 500,
      qualifications: ['PhD in Plant Pathology', 'Certified Crop Advisor'],
      description: 'Expert in identifying and treating crop diseases with 15+ years of field experience.'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      specialty: 'Organic Farming',
      experience: 12,
      rating: 4.9,
      totalConsultations: 890,
      languages: ['Hindi', 'English'],
      availability: 'available',
      pricePerSession: 450,
      qualifications: ['MSc Agriculture', 'Organic Certification Expert'],
      description: 'Specialist in sustainable and organic farming practices, soil health management.'
    },
    {
      id: '3',
      name: 'Suresh Patel',
      specialty: 'Irrigation & Water Management',
      experience: 18,
      rating: 4.7,
      totalConsultations: 1500,
      languages: ['Hindi', 'Gujarati', 'English'],
      availability: 'busy',
      pricePerSession: 600,
      qualifications: ['Water Management Engineer', '20+ Years Field Experience'],
      description: 'Expert in modern irrigation techniques, water conservation, and efficient farming.'
    },
    {
      id: '4',
      name: 'Dr. Anjali Singh',
      specialty: 'Soil Science & Fertilizers',
      experience: 10,
      rating: 4.6,
      totalConsultations: 750,
      languages: ['Hindi', 'English'],
      availability: 'available',
      pricePerSession: 400,
      qualifications: ['PhD Soil Science', 'Fertilizer Specialist'],
      description: 'Soil testing expert and fertilizer recommendation specialist for better yields.'
    },
    {
      id: '5',
      name: 'Vikram Joshi',
      specialty: 'Market Linkage & Pricing',
      experience: 8,
      rating: 4.5,
      totalConsultations: 600,
      languages: ['Hindi', 'English', 'Marathi'],
      availability: 'offline',
      pricePerSession: 350,
      qualifications: ['MBA Agribusiness', 'Market Analysis Expert'],
      description: 'Expert in crop pricing, market trends, and connecting farmers with buyers.'
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available Now';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const handleBookConsultation = (expert: Expert) => {
    setSelectedExpert(expert);
    setConsultationRequest(prev => ({ ...prev, expertId: expert.id }));
    setShowBooking(true);
  };

  const handleSubmitRequest = () => {
    // Here you would typically send the consultation request to your backend
    console.log('Consultation request:', consultationRequest);
    alert(`Consultation request sent to ${selectedExpert?.name}! You will receive a confirmation shortly.`);
    setShowBooking(false);
    setSelectedExpert(null);
    setConsultationRequest({
      expertId: '',
      type: 'chat',
      description: '',
      urgency: 'medium'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Users className="mr-3 text-emerald-600" size={28} />
          Expert Consultation
        </h1>
        <p className="text-gray-600">
          Connect with agricultural experts for personalized farming advice and solutions
        </p>
      </div>

      {/* Expert List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Experts</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {experts.map((expert) => (
            <div key={expert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="text-emerald-600" size={24} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                    <p className="text-emerald-600 font-medium">{expert.specialty}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(expert.availability)}`}>
                  {getAvailabilityText(expert.availability)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{expert.experience} years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="ml-1 font-medium">{expert.rating}</span>
                    <span className="text-gray-500 ml-1">({expert.totalConsultations})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Session Price:</span>
                  <span className="font-medium text-emerald-600">₹{expert.pricePerSession}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {expert.languages.map((lang, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Qualifications:</p>
                <div className="space-y-1">
                  {expert.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-700">
                      <Award className="mr-1" size={12} />
                      {qual}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{expert.description}</p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleBookConsultation(expert)}
                  disabled={expert.availability === 'offline'}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Calendar size={16} className="mr-2" />
                  Book Session
                </button>
                <button
                  disabled={expert.availability !== 'available'}
                  className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Book Consultation</h3>
              <button
                onClick={() => setShowBooking(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Expert: <span className="font-medium">{selectedExpert.name}</span></p>
              <p className="text-sm text-gray-600">Specialty: <span className="font-medium">{selectedExpert.specialty}</span></p>
              <p className="text-sm text-gray-600">Price: <span className="font-medium text-emerald-600">₹{selectedExpert.pricePerSession}</span></p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setConsultationRequest(prev => ({ ...prev, type: 'chat' }))}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-center ${
                      consultationRequest.type === 'chat' 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'border-gray-300 hover:border-emerald-600'
                    }`}
                  >
                    <MessageCircle size={16} className="mr-1" />
                    Chat
                  </button>
                  <button
                    onClick={() => setConsultationRequest(prev => ({ ...prev, type: 'voice' }))}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-center ${
                      consultationRequest.type === 'voice' 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'border-gray-300 hover:border-emerald-600'
                    }`}
                  >
                    <Phone size={16} className="mr-1" />
                    Voice
                  </button>
                  <button
                    onClick={() => setConsultationRequest(prev => ({ ...prev, type: 'video' }))}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-center ${
                      consultationRequest.type === 'video' 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'border-gray-300 hover:border-emerald-600'
                    }`}
                  >
                    <Video size={16} className="mr-1" />
                    Video
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                <select
                  value={consultationRequest.urgency}
                  onChange={(e) => setConsultationRequest(prev => ({ ...prev, urgency: e.target.value as 'low' | 'medium' | 'high' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="low">Low - Within a week</option>
                  <option value="medium">Medium - Within 2-3 days</option>
                  <option value="high">High - Today/Tomorrow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe your issue</label>
                <textarea
                  value={consultationRequest.description}
                  onChange={(e) => setConsultationRequest(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe your farming issue, crop problem, or what you need help with..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={consultationRequest.preferredTime}
                  onChange={(e) => setConsultationRequest(prev => ({ ...prev, preferredTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBooking(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={!consultationRequest.description.trim()}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Send size={16} className="mr-2" />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
        <h3 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center">
          <Badge className="mr-2" size={20} />
          Tips for Better Consultations
        </h3>
        <ul className="space-y-2 text-emerald-800">
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Prepare clear photos of your crops or problems before the session
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Have your farm details ready (size, location, current crops, soil type)
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Write down your specific questions or concerns beforehand
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Choose video calls for visual problems like diseases or pest issues
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExpertConsultation;
