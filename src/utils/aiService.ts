import { askGemini } from "./geminiService";

export const generateCropRecommendations = async (farmInput: any) => {
  try {
    const { budget, season, soilType, farmSize, weather, location } = farmInput;
    const prompt = `Suggest the best crops to grow for the following farm details:
Budget: ${budget}
Season: ${season}
Soil Type: ${soilType}
Farm Size: ${farmSize}
Weather: ${weather}
Location: ${location}

Please provide 3-4 crop recommendations as a JSON array only (no markdown, no explanation). Each crop should have:
- name
- suitability (High/Medium/Low)
- expectedYield
- roi (return on investment)
- requirements (array of strings)
- tips (array of strings)

Return only the JSON array, nothing else.`;
    
    const responseText = await askGemini(prompt);
    const response = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
    try {
      // Extract JSON from markdown code blocks if present
      let jsonString = response;
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      }
      
  const recommendations = JSON.parse(jsonString);
      return Array.isArray(recommendations) ? recommendations : [recommendations];
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      // Format the raw response in a readable way
      const formattedResponse = response.replace(/```json|```/g, '').trim();
      return [{
        name: 'Gemini AI Recommendation',
        suitability: 'AI-powered',
        expectedYield: 'See details below',
        roi: 'Based on market analysis',
        requirements: ['Follow AI guidance'],
        tips: [formattedResponse]
      }];
    }
  } catch (err) {
    console.error('Gemini API error, using mock data:', err);
    // Fallback to mock recommendations if Gemini API fails
    return [
      {
        name: 'Rice',
        suitability: 'High',
        expectedYield: '40-50 quintals/hectare',
        roi: '₹35,000 - ₹55,000',
        requirements: ['Well-drained clay soil', 'Consistent water supply', 'High organic matter'],
        tips: ['Use certified seeds', 'Implement SRI method for higher yield', 'Monitor for pests during monsoon']
      },
      {
        name: 'Wheat',
        suitability: 'Medium',
        expectedYield: '25-35 quintals/hectare',
        roi: '₹30,000 - ₹45,000',
        requirements: ['Loamy to clay-loam soil', 'Cool winter weather', 'Moderate irrigation'],
        tips: ['Sow in November-December', 'Use improved varieties', 'Apply fertilizers in splits']
      }
    ];
  }
};

export const generatePestAnalysis = async (imageFile?: any) => {
  // Mock pest analysis - in production this would use image recognition
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In production, this would analyze the imageFile
  console.log('Analyzing image:', imageFile?.name || 'unnamed file');

  const pestTypes = [
    {
      name: 'White Grub',
      crops: ['sugarcane', 'potato'],
      severity: ['Medium', 'High'],
      confidence: [70, 85],
      treatments: ['soil treatment', 'biological control', 'crop rotation'],
      symptoms: ['wilting plants', 'root damage', 'yellowing']
    },
    {
      name: 'Stem Borer',
      crops: ['rice', 'sugarcane'],
      severity: ['Medium'],
      confidence: [80, 90],
      treatments: ['pheromone traps', 'egg mass collection', 'resistant varieties'],
      symptoms: ['dead hearts', 'white ears', 'exit holes']
    },
    {
      name: 'Leaf Hopper',
      crops: ['rice'],
      severity: ['Low', 'Medium'],
      confidence: [70, 85],
      treatments: ['yellow sticky traps', 'neem oil', 'reflective mulch'],
      symptoms: ['leaf yellowing', 'hopper burn', 'stunted growth']
    }
  ];

  const randomPest = pestTypes[Math.floor(Math.random() * pestTypes.length)];
  const selectedSeverity = randomPest.severity[Math.floor(Math.random() * randomPest.severity.length)];
  const confidence = randomPest.confidence[0] + Math.floor(Math.random() * (randomPest.confidence[1] - randomPest.confidence[0]));

  return {
    pestDetected: true,
    pestType: randomPest.name,
    confidence: confidence,
    severity: selectedSeverity,
    affectedCrops: randomPest.crops,
    symptoms: randomPest.symptoms,
    recommendations: [
      `Apply ${randomPest.treatments[Math.floor(Math.random() * randomPest.treatments.length)]}`,
      'Monitor field regularly',
      'Maintain field hygiene',
      'Consider organic alternatives'
    ],
    preventiveMeasures: [
      'Use certified disease-free seeds',
      'Maintain proper plant spacing',
      'Regular field inspection',
      'Rotate crops to break pest cycles'
    ],
    economicThreshold: selectedSeverity === 'High' ? 'Exceeded - Immediate action required' : 
                     selectedSeverity === 'Medium' ? 'Approaching - Monitor closely' : 'Below threshold - Preventive measures sufficient',
    seasonalPattern: `Peak activity during ${Math.random() > 0.5 ? 'monsoon' : 'post-monsoon'} season`,
    weatherImpact: 'High humidity and temperature favor pest development'
  };
};

export const generateHealthCardSummary = async (seasonData: any) => {
  // Simulate OpenAI API call for health card generation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract meaningful data from season input
  const seasons = Array.isArray(seasonData) ? seasonData : [seasonData];
  const totalSeasons = seasons.length;
  
  // Calculate performance metrics
  let totalRevenue = 0;
  let totalPestIncidents = 0;
  let soilHealthScores: number[] = [];
  let cropsGrown = new Set<string>();
  let yields: number[] = [];
  
  seasons.forEach((season: any) => {
    if (season?.revenue) {
      const revenueNum = parseInt(season.revenue.replace(/[₹,]/g, '') || '0');
      totalRevenue += revenueNum;
    }
    if (season?.pestIncidents) {
      totalPestIncidents += season.pestIncidents;
    }
    if (season?.soilHealth) {
      const healthScoreMap: { [key: string]: number } = {
        'Excellent': 95,
        'Good': 80,
        'Average': 65,
        'Poor': 40
      };
      const healthScore = healthScoreMap[season.soilHealth] || 65;
      soilHealthScores.push(healthScore);
    }
    if (season?.cropsGrown) {
      season.cropsGrown.forEach((crop: string) => cropsGrown.add(crop));
    }
    if (season?.totalYield) {
      const yieldNum = parseInt(season.totalYield.replace(/[^0-9]/g, '') || '0');
      yields.push(yieldNum);
    }
  });
  
  const avgRevenue = totalRevenue / totalSeasons;
  const avgSoilHealth = soilHealthScores.reduce((a, b) => a + b, 0) / soilHealthScores.length || 75;
  const avgPestIncidents = totalPestIncidents / totalSeasons;
  const avgYield = yields.reduce((a, b) => a + b, 0) / yields.length || 150;
  const diversificationScore = cropsGrown.size;
  
  // Generate dynamic summary based on performance
  let summary = '';
  let overallScore = 0;
  let recommendations = [];
  let schemeEligibility = ['PM-KISAN']; // Base eligibility
  
  // Performance analysis
  if (avgRevenue > 350000) {
    summary += 'Excellent farm performance with strong revenue generation. ';
    overallScore += 30;
  } else if (avgRevenue > 250000) {
    summary += 'Good farm performance with steady revenue streams. ';
    overallScore += 25;
  } else {
    summary += 'Farm performance shows potential for improvement in revenue optimization. ';
    overallScore += 15;
    recommendations.push('Explore high-value crops or value addition opportunities');
  }
  
  if (avgSoilHealth > 85) {
    summary += 'Soil health management is exemplary with sustainable practices. ';
    overallScore += 25;
    schemeEligibility.push('Organic Farming Scheme');
  } else if (avgSoilHealth > 70) {
    summary += 'Soil health is well-maintained with good management practices. ';
    overallScore += 20;
  } else {
    summary += 'Soil health requires attention and improved management. ';
    overallScore += 10;
    recommendations.push('Implement soil conservation measures and organic matter enhancement');
    recommendations.push('Consider soil testing and micronutrient management');
  }
  
  if (avgPestIncidents < 2) {
    summary += 'Effective integrated pest management with minimal crop losses.';
    overallScore += 20;
  } else if (avgPestIncidents < 4) {
    summary += 'Moderate pest pressure managed through regular monitoring.';
    overallScore += 15;
    recommendations.push('Strengthen IPM practices and early warning systems');
  } else {
    summary += 'High pest incidence requires improved pest management strategies.';
    overallScore += 5;
    recommendations.push('Implement comprehensive IPM approach');
    recommendations.push('Consider resistant varieties and biological control');
  }
  
  // Crop diversification analysis
  if (diversificationScore >= 4) {
    overallScore += 15;
    summary += ' Excellent crop diversification reduces market risks.';
    schemeEligibility.push('Crop Diversification Scheme');
  } else if (diversificationScore >= 2) {
    overallScore += 10;
    recommendations.push('Consider diversifying with complementary crops');
  } else {
    overallScore += 5;
    recommendations.push('Diversify crop portfolio to reduce risks and improve soil health');
  }
  
  // Yield analysis
  if (avgYield > 200) {
    overallScore += 10;
    schemeEligibility.push('High Productivity Incentive');
  } else if (avgYield < 100) {
    recommendations.push('Focus on yield improvement through better inputs and practices');
  }
  
  // Additional scheme eligibility based on performance
  if (totalRevenue > 200000) {
    schemeEligibility.push('KCC Loan', 'PMFBY');
  }
  
  if (avgSoilHealth > 80 && avgPestIncidents < 3) {
    schemeEligibility.push('Sustainable Agriculture Certification');
  }
  
  if (cropsGrown.has('Rice') || cropsGrown.has('Wheat')) {
    schemeEligibility.push('MSP Procurement');
  }
  
  // Base recommendations
  const baseRecommendations = [
    'Continue regular soil testing every 2 years',
    'Maintain detailed farm records for better analysis',
    'Participate in farmer training programs',
    'Consider farm insurance for risk management'
  ];
  
  // Combine and limit recommendations
  recommendations = [...recommendations, ...baseRecommendations].slice(0, 5);
  
  // Performance categories for detailed breakdown
  const performanceBreakdown = {
    'Revenue Generation': Math.min(Math.round((avgRevenue / 400000) * 100), 100),
    'Soil Health': Math.round(avgSoilHealth),
    'Pest Management': Math.max(100 - (avgPestIncidents * 20), 20),
    'Crop Diversification': Math.min(diversificationScore * 25, 100),
    'Yield Efficiency': Math.min(Math.round((avgYield / 250) * 100), 100)
  };
  
  return {
    summary: summary.trim(),
    recommendations: recommendations,
    schemeEligibility: [...new Set(schemeEligibility)], // Remove duplicates
    overallScore: Math.min(overallScore, 100),
    performanceBreakdown: performanceBreakdown,
    keyMetrics: {
      averageRevenue: `₹${Math.round(avgRevenue).toLocaleString()}`,
      soilHealthScore: `${Math.round(avgSoilHealth)}/100`,
      pestIncidentsPerSeason: Math.round(avgPestIncidents * 10) / 10,
      cropDiversification: `${diversificationScore} different crops`,
      averageYield: `${Math.round(avgYield)} quintals/season`
    },
    trendAnalysis: {
      revenueGrowth: totalSeasons > 1 ? `${Math.round((Math.random() - 0.5) * 30)}%` : 'Insufficient data',
      yieldTrend: totalSeasons > 1 ? (Math.random() > 0.6 ? 'Improving' : 'Stable') : 'Baseline established',
      sustainabilityIndex: avgSoilHealth > 80 && avgPestIncidents < 3 ? 'High' : avgSoilHealth > 60 ? 'Medium' : 'Needs Improvement'
    },
    nextSteps: [
      'Schedule soil health assessment',
      'Plan crop rotation for next season',
      'Apply for relevant government schemes',
      'Set up farm record management system'
    ]
  };
};