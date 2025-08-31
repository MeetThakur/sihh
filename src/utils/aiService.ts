// Mock AI service functions - in production these would call actual APIs

export const generateCropRecommendations = async (farmInput: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { budget, season, soilType, farmSize } = farmInput;
  const budgetNum = parseInt(budget?.replace(/[₹,]/g, '') || '0');
  const sizeNum = parseFloat(farmSize?.replace(/[^0-9.]/g, '') || '1');
  
  // Determine suitable crops based on inputs
  let recommendations = [];
  
  // Season-based filtering
  const currentSeason = season?.toLowerCase();
  const soilKey = soilType?.toLowerCase();
  
  if (currentSeason === 'kharif' || currentSeason === 'monsoon') {
    // High water availability crops
    if (budgetNum > 100000 && sizeNum >= 2) {
      recommendations.push({
        name: 'Rice (Basmati)',
        suitability: 'High' as const,
        expectedYield: `${Math.round(40 + Math.random() * 15)}-${Math.round(50 + Math.random() * 10)} quintals/hectare`,
        roi: `₹${Math.round(35000 + Math.random() * 15000).toLocaleString()} - ₹${Math.round(55000 + Math.random() * 15000).toLocaleString()}`,
        requirements: ['Well-drained clay soil', 'Consistent water supply', 'High organic matter'],
        tips: [`Best planting time: ${currentSeason === 'kharif' ? 'June-July' : 'May-June'}`, 'Use certified seeds', 'Implement SRI method for 20-30% higher yield']
      });
    }
    
    if (budgetNum > 50000) {
      recommendations.push({
        name: 'Rice (Non-Basmati)',
        suitability: budgetNum > 80000 ? 'High' as const : 'Medium' as const,
        expectedYield: `${Math.round(35 + Math.random() * 10)}-${Math.round(45 + Math.random() * 10)} quintals/hectare`,
        roi: `₹${Math.round(25000 + Math.random() * 10000).toLocaleString()} - ₹${Math.round(35000 + Math.random() * 10000).toLocaleString()}`,
        requirements: ['Clay to clay-loam soil', 'Adequate water supply', 'Balanced fertilization'],
        tips: ['Shorter duration varieties for quick returns', 'Monitor for brown planthopper', 'Maintain 20cm water level initially']
      });
    }
    
    if (sizeNum >= 3 && budgetNum > 150000) {
      recommendations.push({
        name: 'Sugarcane',
        suitability: 'High' as const,
        expectedYield: `${Math.round(400 + Math.random() * 100)}-${Math.round(550 + Math.random() * 100)} quintals/hectare`,
        roi: `₹${Math.round(80000 + Math.random() * 30000).toLocaleString()} - ₹${Math.round(120000 + Math.random() * 30000).toLocaleString()}`,
        requirements: ['Deep fertile soil', 'Very high water requirement', 'Long-term commitment'],
        tips: ['Plant quality seed cane', 'Ensure drip irrigation if possible', '12-18 month crop cycle']
      });
    }
    
    recommendations.push({
      name: 'Maize (Hybrid)',
      suitability: budgetNum > 40000 ? 'High' as const : 'Medium' as const,
      expectedYield: `${Math.round(30 + Math.random() * 15)}-${Math.round(40 + Math.random() * 15)} quintals/hectare`,
      roi: `₹${Math.round(20000 + Math.random() * 10000).toLocaleString()} - ₹${Math.round(35000 + Math.random() * 10000).toLocaleString()}`,
      requirements: ['Well-drained soil', 'Moderate water needs', 'Good sunlight'],
      tips: ['Use hybrid varieties for better yield', 'Apply balanced NPK fertilizers', 'Harvest at proper moisture content']
    });
    
  } else if (currentSeason === 'rabi' || currentSeason === 'winter') {
    // Cool season crops
    recommendations.push({
      name: 'Wheat',
      suitability: 'High' as const,
      expectedYield: `${Math.round(25 + Math.random() * 10)}-${Math.round(35 + Math.random() * 10)} quintals/hectare`,
      roi: `₹${Math.round(30000 + Math.random() * 15000).toLocaleString()} - ₹${Math.round(45000 + Math.random() * 15000).toLocaleString()}`,
      requirements: ['Loamy to clay-loam soil', 'Cool weather', 'Moderate irrigation'],
      tips: ['Sow in November-December', 'Use improved varieties like HD-2967', 'Apply urea in 2-3 splits']
    });
    
    if (budgetNum > 60000) {
      recommendations.push({
        name: 'Mustard',
        suitability: 'High' as const,
        expectedYield: `${Math.round(8 + Math.random() * 6)}-${Math.round(15 + Math.random() * 5)} quintals/hectare`,
        roi: `₹${Math.round(40000 + Math.random() * 20000).toLocaleString()} - ₹${Math.round(65000 + Math.random() * 20000).toLocaleString()}`,
        requirements: ['Well-drained soil', 'Cool dry weather', 'Low water requirement'],
        tips: ['High oil prices make it profitable', 'Line sowing recommended', 'Harvest when 75% pods turn brown']
      });
    }
    
    if (soilKey?.includes('sandy') || soilKey?.includes('loam')) {
      recommendations.push({
        name: 'Potato',
        suitability: budgetNum > 80000 ? 'High' as const : 'Medium' as const,
        expectedYield: `${Math.round(150 + Math.random() * 80)}-${Math.round(250 + Math.random() * 80)} quintals/hectare`,
        roi: `₹${Math.round(60000 + Math.random() * 40000).toLocaleString()} - ₹${Math.round(120000 + Math.random() * 40000).toLocaleString()}`,
        requirements: ['Sandy-loam soil', 'Cool weather', 'Regular irrigation'],
        tips: ['High value crop with good returns', 'Use certified seed potatoes', 'Proper storage essential']
      });
    }
    
  } else {
    // Zaid/Summer season
    recommendations.push({
      name: 'Maize (Zaid)',
      suitability: 'Medium' as const,
      expectedYield: `${Math.round(25 + Math.random() * 10)}-${Math.round(35 + Math.random() * 10)} quintals/hectare`,
      roi: `₹${Math.round(25000 + Math.random() * 15000).toLocaleString()} - ₹${Math.round(40000 + Math.random() * 15000).toLocaleString()}`,
      requirements: ['Irrigation facilities', 'Heat-tolerant varieties', 'Adequate water supply'],
      tips: ['Limited to irrigated areas', 'Use short-duration varieties', 'Provide adequate nutrition']
    });
  }
  
  // Add soil-specific recommendations
  if (soilKey?.includes('clay') && !recommendations.find(r => r.name.includes('Rice'))) {
    recommendations.unshift({
      name: 'Rice (suitable for clay soil)',
      suitability: 'High' as const,
      expectedYield: `${Math.round(35 + Math.random() * 15)}-${Math.round(50 + Math.random() * 10)} quintals/hectare`,
      roi: `₹${Math.round(30000 + Math.random() * 20000).toLocaleString()} - ₹${Math.round(50000 + Math.random() * 20000).toLocaleString()}`,
      requirements: ['Clay soil is ideal', 'Proper water management', 'Balanced fertilization'],
      tips: ['Clay soil retains water well', 'Ensure proper drainage', 'Use appropriate varieties']
    });
  }
  
  // Budget-based filtering and sorting
  if (budgetNum < 50000) {
    recommendations = recommendations.filter(r => !r.name.includes('Sugarcane') && !r.name.includes('Potato'));
    recommendations = recommendations.slice(0, 2); // Limit options for low budget
  } else if (budgetNum > 200000) {
    // Add premium options for high budget
    recommendations.unshift({
      name: 'Organic Rice (Premium)',
      suitability: 'High' as const,
      expectedYield: `${Math.round(25 + Math.random() * 10)}-${Math.round(35 + Math.random() * 10)} quintals/hectare`,
      roi: `₹${Math.round(60000 + Math.random() * 30000).toLocaleString()} - ₹${Math.round(90000 + Math.random() * 30000).toLocaleString()}`,
      requirements: ['Organic certification', 'Premium market access', 'Extended growing period'],
      tips: ['Higher margins in organic market', 'Requires 3-year transition period', 'Focus on soil health']
    });
  }
  
  return recommendations.slice(0, 4); // Return top 4 recommendations
};

export const analyzePestImage = async (imageFile: File) => {
  // Simulate Gemini Vision API call
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Extract some basic info from filename for variety
  const fileSize = imageFile.size;
  
  // Simulate different pest detection based on various factors
  const pestTypes = [
    {
      name: 'Brown Planthopper',
      crops: ['rice'],
      severity: ['Medium', 'High'],
      confidence: [80, 95],
      treatments: ['neem oil', 'systemic insecticide', 'predator release'],
      symptoms: ['yellowing leaves', 'stunted growth', 'honeydew deposits']
    },
    {
      name: 'Fall Armyworm',
      crops: ['maize', 'sugarcane'],
      severity: ['High'],
      confidence: [85, 92],
      treatments: ['Bt spray', 'chemical control', 'pheromone traps'],
      symptoms: ['leaf damage', 'holes in leaves', 'frass deposits']
    },
    {
      name: 'Aphids',
      crops: ['wheat', 'mustard'],
      severity: ['Low', 'Medium'],
      confidence: [75, 88],
      treatments: ['insecticidal soap', 'neem oil', 'beneficial insects'],
      symptoms: ['curled leaves', 'sticky honeydew', 'sooty mold']
    },
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
  
  // Random selection but weighted by common pests
  const randomPest = pestTypes[Math.floor(Math.random() * pestTypes.length)];
  const selectedSeverity = randomPest.severity[Math.floor(Math.random() * randomPest.severity.length)];
  const confidence = randomPest.confidence[0] + Math.floor(Math.random() * (randomPest.confidence[1] - randomPest.confidence[0]));
  
  // Simulate different responses based on file characteristics
  let pestDetected = true;
  if (fileSize < 100000) { // Small file size might indicate unclear image
    pestDetected = Math.random() > 0.3; // 70% chance of detection
  }
  
  if (!pestDetected) {
    return {
      pestDetected: false,
      message: 'No clear pest symptoms detected in the image',
      confidence: Math.floor(Math.random() * 40) + 30, // 30-70% confidence
      recommendations: [
        'Try capturing a clearer image with better lighting',
        'Focus on affected plant parts',
        'Include surrounding area for context',
        'Consult with local agricultural extension officer'
      ],
      generalTips: [
        'Regular field monitoring is essential',
        'Early detection prevents major outbreaks',
        'Maintain field hygiene'
      ]
    };
  }
  
  // Generate dynamic recommendations based on pest type and severity
  let recommendations = [];
  let preventiveMeasures = [];
  
  if (selectedSeverity === 'High') {
    recommendations = [
      `Apply ${randomPest.treatments[Math.floor(Math.random() * randomPest.treatments.length)]} immediately`,
      'Monitor field twice daily for spread',
      'Isolate affected areas if possible',
      'Consider professional pest control consultation',
      'Document outbreak for future reference'
    ];
  } else if (selectedSeverity === 'Medium') {
    recommendations = [
      `Use ${randomPest.treatments[Math.floor(Math.random() * randomPest.treatments.length)]} treatment`,
      'Increase monitoring frequency',
      'Check neighboring plots for similar symptoms',
      'Apply organic treatment methods first',
      'Monitor weather conditions affecting pest activity'
    ];
  } else {
    recommendations = [
      'Continue monitoring without immediate intervention',
      `Consider ${randomPest.treatments[Math.floor(Math.random() * randomPest.treatments.length)]} if symptoms worsen`,
      'Improve field sanitation',
      'Document current pest levels',
      'Check for beneficial predator presence'
    ];
  }
  
  // Generate preventive measures
  preventiveMeasures = [
    'Use certified disease-free seeds',
    'Maintain proper plant spacing for air circulation',
    'Regular field inspection and monitoring',
    'Rotate crops to break pest cycles',
    'Encourage beneficial insects through habitat management',
    'Maintain field hygiene by removing crop residues'
  ];
  
  return {
    pestDetected: true,
    pestType: randomPest.name,
    confidence: confidence,
    severity: selectedSeverity,
    affectedCrops: randomPest.crops,
    symptoms: randomPest.symptoms,
    recommendations: recommendations.slice(0, 4),
    preventiveMeasures: preventiveMeasures.slice(0, 4),
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