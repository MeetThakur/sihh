// Mock AI service functions - in production these would call actual APIs

export const generateCropRecommendations = async (farmInput: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock OpenAI API response
  return [
    {
      name: 'Rice (Basmati)',
      suitability: 'High' as const,
      expectedYield: '45-50 quintals/hectare',
      roi: '₹35,000 - ₹45,000',
      requirements: ['Well-drained clay soil', 'Consistent water supply', 'Moderate fertilizer'],
      tips: ['Plant during July-August', 'Use SRI method for better yield', 'Monitor for brown planthopper']
    },
    {
      name: 'Wheat',
      suitability: 'Medium' as const,
      expectedYield: '30-35 quintals/hectare',
      roi: '₹25,000 - ₹30,000',
      requirements: ['Loamy soil', 'Cool weather', 'Nitrogen-rich fertilizer'],
      tips: ['Suitable for rabi season', 'Ensure proper drainage', 'Consider drought-resistant varieties']
    }
  ];
};

export const analyzePestImage = async (imageFile: File) => {
  // Simulate Gemini Vision API call
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    pestDetected: true,
    pestType: 'Brown Planthopper',
    confidence: 87,
    severity: 'Medium',
    recommendations: [
      'Apply neem oil spray immediately',
      'Increase field drainage',
      'Monitor neighboring plots',
      'Consider systemic insecticide if infestation spreads'
    ],
    preventiveMeasures: [
      'Use resistant rice varieties',
      'Maintain proper plant spacing',
      'Regular monitoring of field conditions'
    ]
  };
};

export const generateHealthCardSummary = async (seasonData: any) => {
  // Simulate OpenAI API call for health card generation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    summary: 'Farm performance shows consistent improvement with sustainable practices',
    recommendations: [
      'Continue current soil management practices',
      'Consider organic certification for premium markets',
      'Implement drip irrigation for water efficiency'
    ],
    schemeEligibility: ['PM-KISAN', 'PMFBY', 'KCC Loan'],
    overallScore: 85
  };
};