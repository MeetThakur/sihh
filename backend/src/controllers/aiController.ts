import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../config/logger';
import CropAdvisory, { ICropRecommendation } from '../models/CropAdvisory';
import User from '../models/User';
import Farm from '../models/Farm';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Enhanced prompt templates for different AI services
const PROMPT_TEMPLATES = {
  cropAdvisory: `You are an expert agricultural advisor with deep knowledge of Indian farming practices, crop science, and market conditions.

  Farmer Details:
  - Location: {location}
  - Farm Size: {farmSize} acres
  - Soil Type: {soilType}
  - Budget: ₹{budget}
  - Season: {season}
  - Experience Level: {experience}
  - Farming Method: {farmingMethod}
  - Water Availability: {waterAvailability}
  - Labor Availability: {laborAvailability}

  Please provide detailed crop recommendations in the following JSON format:
  {
    "recommendations": [
      {
        "crop": "string",
        "variety": "string",
        "confidence": number (0-100),
        "expectedYield": number (tons/acre),
        "expectedRevenue": number (INR),
        "investmentRequired": number (INR),
        "roi": number (percentage),
        "riskLevel": "low|medium|high",
        "reasons": ["string"],
        "warnings": ["string"],
        "timeline": {
          "sowingStart": "YYYY-MM-DD",
          "sowingEnd": "YYYY-MM-DD",
          "harvestStart": "YYYY-MM-DD",
          "harvestEnd": "YYYY-MM-DD"
        },
        "requirements": {
          "soilType": ["string"],
          "climate": "string",
          "water": number (liters/day/acre),
          "fertilizers": [
            {
              "name": "string",
              "quantity": number,
              "unit": "string",
              "applicationTime": "string"
            }
          ],
          "pesticides": [
            {
              "name": "string",
              "usage": "string",
              "precautions": ["string"]
            }
          ]
        }
      }
    ],
    "generalAdvice": "string",
    "seasonalTips": ["string"],
    "marketInsights": "string"
  }

  Provide 3-5 crop recommendations suitable for the given conditions. Consider local climate, market demand, profitability, and risk factors.`,

  chatbot: `You are KhetSetu AI Assistant, a knowledgeable agricultural expert specializing in Indian farming practices. You provide helpful, accurate, and practical advice to farmers.

  Guidelines:
  - Always be supportive and encouraging
  - Provide specific, actionable advice
  - Consider Indian farming conditions and practices
  - Mention government schemes when relevant
  - Use simple language that farmers can understand
  - If asked about medical issues, recommend consulting a doctor
  - If asked about legal issues, recommend consulting appropriate authorities

  User Context: {userContext}
  Previous Conversation: {conversationHistory}

  User Question: {question}

  Please provide a helpful response in the user's preferred language ({language}).`,

  pestIdentification: `You are an expert entomologist and plant pathologist specializing in Indian agriculture.

  Based on the following description and image (if provided):
  Crop: {crop}
  Symptoms: {symptoms}
  Location: {location}
  Season: {season}
  Image Analysis: {imageAnalysis}

  Please provide:
  1. Most likely pest/disease identification
  2. Confidence level (0-100%)
  3. Treatment recommendations (organic and chemical options)
  4. Prevention measures
  5. Urgency level (low/medium/high/critical)
  6. Expected damage if untreated
  7. Cost-effective treatment options

  Format your response as JSON:
  {
    "identification": {
      "name": "string",
      "scientificName": "string",
      "type": "pest|disease|deficiency",
      "confidence": number
    },
    "treatment": {
      "immediate": ["string"],
      "organic": ["string"],
      "chemical": ["string"],
      "preventive": ["string"]
    },
    "severity": "low|medium|high|critical",
    "estimatedCost": number,
    "timeToRecover": "string"
  }`,

  soilAnalysis: `You are a soil scientist expert in Indian agricultural soils.

  Based on the soil test data:
  pH: {ph}
  Nitrogen: {nitrogen}
  Phosphorus: {phosphorus}
  Potassium: {potassium}
  Organic Matter: {organicMatter}
  Location: {location}
  Soil Type: {soilType}
  Intended Crop: {intendedCrop}

  Provide detailed soil analysis and recommendations:
  {
    "analysis": {
      "overall": "excellent|good|fair|poor|critical",
      "ph": {
        "status": "string",
        "recommendation": "string"
      },
      "nutrients": {
        "nitrogen": "string",
        "phosphorus": "string",
        "potassium": "string"
      },
      "organicMatter": "string"
    },
    "recommendations": {
      "fertilizers": [
        {
          "name": "string",
          "quantity": "string",
          "timing": "string",
          "cost": number
        }
      ],
      "amendments": ["string"],
      "practices": ["string"]
    },
    "suitability": {
      "crop": "string",
      "rating": number,
      "limitations": ["string"],
      "improvements": ["string"]
    }
  }`
};

// Chat with AI assistant
export const chat = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message, context = {}, conversationHistory = [] } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    // Prepare user context
    const userContext = {
      name: user.name,
      location: user.profile?.location,
      farmSize: user.profile?.farmSize,
      experience: user.profile?.farmingExperience,
      preferredLanguage: user.profile?.preferredLanguage || 'en',
      primaryCrops: user.profile?.primaryCrops || []
    };

    // Format conversation history
    const formattedHistory = conversationHistory
      .slice(-5) // Keep last 5 exchanges
      .map((item: any) => `User: ${item.user}\nAssistant: ${item.assistant}`)
      .join('\n\n');

    // Create prompt
    const prompt = PROMPT_TEMPLATES.chatbot
      .replace('{userContext}', JSON.stringify(userContext))
      .replace('{conversationHistory}', formattedHistory)
      .replace('{question}', message)
      .replace('{language}', userContext.preferredLanguage === 'hi' ? 'Hindi' : 'English');

    const startTime = Date.now();

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const processingTime = Date.now() - startTime;

    logger.info(`AI Chat completed for user ${user.email} in ${processingTime}ms`);

    res.json({
      success: true,
      message: 'AI response generated successfully',
      data: {
        response: text,
        processingTime,
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('AI Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response',
      error: 'AI_CHAT_ERROR'
    });
  }
};

// Get crop advice with detailed recommendations
export const getCropAdvice = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      budget,
      farmSize,
      soilType,
      location,
      season,
      experience,
      farmingMethod,
      waterAvailability,
      laborAvailability,
      constraints = {}
    } = req.body;

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    // Create detailed prompt
    const prompt = PROMPT_TEMPLATES.cropAdvisory
      .replace('{location}', `${location.district}, ${location.state}`)
      .replace('{farmSize}', farmSize.toString())
      .replace('{soilType}', soilType)
      .replace('{budget}', budget.toString())
      .replace('{season}', season)
      .replace('{experience}', experience)
      .replace('{farmingMethod}', farmingMethod)
      .replace('{waterAvailability}', waterAvailability || 'moderate')
      .replace('{laborAvailability}', laborAvailability || 'moderate');

    const startTime = Date.now();

    // Call Gemini AI
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const processingTime = Date.now() - startTime;

    // Try to parse JSON response
    let parsedResponse;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      logger.warn('Failed to parse AI response as JSON, returning raw text');
      parsedResponse = {
        recommendations: [],
        generalAdvice: text,
        seasonalTips: [],
        marketInsights: ''
      };
    }

    // Save crop advisory to database
    const advisoryData = {
      user: user._id,
      requestDetails: {
        budget,
        farmSize,
        soilType,
        location,
        season,
        experience,
        farmingMethod,
        constraints
      },
      recommendations: parsedResponse.recommendations || [],
      aiResponse: {
        model: 'gemini-1.5-flash',
        prompt,
        rawResponse: text,
        processingTime,
        confidence: 85, // Default confidence
        version: '1.0.0'
      }
    };

    const savedAdvisory = await CropAdvisory.create(advisoryData);

    logger.info(`Crop advisory generated for user ${user.email} in ${processingTime}ms`);

    res.json({
      success: true,
      message: 'Crop recommendations generated successfully',
      data: {
        advisory: savedAdvisory,
        recommendations: parsedResponse.recommendations,
        generalAdvice: parsedResponse.generalAdvice,
        seasonalTips: parsedResponse.seasonalTips,
        marketInsights: parsedResponse.marketInsights,
        processingTime
      }
    });

  } catch (error) {
    logger.error('Crop advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate crop recommendations',
      error: 'CROP_ADVICE_ERROR'
    });
  }
};

// Pest identification and treatment recommendations
export const identifyPest = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      crop,
      symptoms,
      location,
      season,
      imageData,
      imageDescription
    } = req.body;

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    // Create prompt for pest identification
    const prompt = PROMPT_TEMPLATES.pestIdentification
      .replace('{crop}', crop)
      .replace('{symptoms}', symptoms)
      .replace('{location}', `${location.district}, ${location.state}`)
      .replace('{season}', season)
      .replace('{imageAnalysis}', imageDescription || 'No image provided');

    const startTime = Date.now();

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let result;
    if (imageData) {
      // If image is provided, use vision capabilities
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg"
        }
      };
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();

    const processingTime = Date.now() - startTime;

    // Parse response
    let parsedResponse;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      parsedResponse = {
        identification: {
          name: 'Unknown pest/disease',
          confidence: 50
        },
        treatment: {
          immediate: ['Consult local agricultural expert'],
          organic: [],
          chemical: [],
          preventive: []
        },
        severity: 'medium',
        rawResponse: text
      };
    }

    logger.info(`Pest identification completed for user ${user.email} in ${processingTime}ms`);

    res.json({
      success: true,
      message: 'Pest identification completed successfully',
      data: {
        identification: parsedResponse.identification,
        treatment: parsedResponse.treatment,
        severity: parsedResponse.severity,
        estimatedCost: parsedResponse.estimatedCost,
        timeToRecover: parsedResponse.timeToRecover,
        processingTime,
        confidence: parsedResponse.identification?.confidence || 50
      }
    });

  } catch (error) {
    logger.error('Pest identification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to identify pest',
      error: 'PEST_IDENTIFICATION_ERROR'
    });
  }
};

// Soil analysis and recommendations
export const analyzeSoil = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      ph,
      nitrogen,
      phosphorus,
      potassium,
      organicMatter,
      soilType,
      location,
      intendedCrop
    } = req.body;

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    // Create prompt for soil analysis
    const prompt = PROMPT_TEMPLATES.soilAnalysis
      .replace('{ph}', ph?.toString() || 'Not provided')
      .replace('{nitrogen}', nitrogen?.toString() || 'Not provided')
      .replace('{phosphorus}', phosphorus?.toString() || 'Not provided')
      .replace('{potassium}', potassium?.toString() || 'Not provided')
      .replace('{organicMatter}', organicMatter?.toString() || 'Not provided')
      .replace('{location}', `${location.district}, ${location.state}`)
      .replace('{soilType}', soilType)
      .replace('{intendedCrop}', intendedCrop || 'General farming');

    const startTime = Date.now();

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const processingTime = Date.now() - startTime;

    // Parse response
    let parsedResponse;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      parsedResponse = {
        analysis: {
          overall: 'fair',
          ph: { status: 'Analysis needed', recommendation: text.substring(0, 200) }
        },
        recommendations: {
          fertilizers: [],
          amendments: [],
          practices: []
        },
        rawResponse: text
      };
    }

    logger.info(`Soil analysis completed for user ${user.email} in ${processingTime}ms`);

    res.json({
      success: true,
      message: 'Soil analysis completed successfully',
      data: {
        analysis: parsedResponse.analysis,
        recommendations: parsedResponse.recommendations,
        suitability: parsedResponse.suitability,
        processingTime,
        testData: {
          ph,
          nitrogen,
          phosphorus,
          potassium,
          organicMatter,
          soilType
        }
      }
    });

  } catch (error) {
    logger.error('Soil analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze soil',
      error: 'SOIL_ANALYSIS_ERROR'
    });
  }
};

// Get AI model status and capabilities
export const getAIStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    // Check if API key is configured
    const isConfigured = !!process.env.GEMINI_API_KEY;

    // Get user's recent AI usage
    const recentUsage = await CropAdvisory.countDocuments({
      user: user._id,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    res.json({
      success: true,
      message: 'AI status retrieved successfully',
      data: {
        status: isConfigured ? 'active' : 'misconfigured',
        model: 'gemini-1.5-flash',
        capabilities: [
          'crop_advisory',
          'pest_identification',
          'soil_analysis',
          'general_chat',
          'image_analysis'
        ],
        dailyUsage: recentUsage,
        maxDailyUsage: user.subscription?.plan === 'premium' ? 100 :
                       user.subscription?.plan === 'basic' ? 50 : 10,
        features: {
          imageAnalysis: true,
          multiLanguage: true,
          contextualAdvice: true,
          marketInsights: true
        }
      }
    });

  } catch (error) {
    logger.error('AI status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI status',
      error: 'AI_STATUS_ERROR'
    });
  }
};

// Generate farming calendar based on crop recommendations
export const generateFarmingCalendar = async (req: Request, res: Response) => {
  try {
    const { advisoryId, selectedCrops } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    // Get the crop advisory
    const advisory = await CropAdvisory.findById(advisoryId);
    if (!advisory || advisory.user.toString() !== user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Crop advisory not found',
        error: 'ADVISORY_NOT_FOUND'
      });
    }

    // Filter recommendations for selected crops
    const selectedRecommendations = advisory.recommendations.filter(
      rec => selectedCrops.includes(rec.crop)
    );

    if (selectedRecommendations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid crop recommendations found for selected crops',
        error: 'NO_RECOMMENDATIONS'
      });
    }

    // Generate detailed farming calendar
    const calendar = selectedRecommendations.map(rec => {
      const activities = [];
      const sowingDate = new Date(rec.timeline.sowingStart);
      const harvestDate = new Date(rec.timeline.harvestStart);

      // Generate weekly activities
      for (let week = 0; week < 16; week++) {
        const activityDate = new Date(sowingDate);
        activityDate.setDate(activityDate.getDate() + (week * 7));

        if (activityDate > harvestDate) break;

        let activity = '';
        let icon = '';

        if (week === 0) {
          activity = `Land preparation and sowing of ${rec.crop}`;
          icon = '🌱';
        } else if (week <= 2) {
          activity = `Irrigation and monitoring seedling growth`;
          icon = '💧';
        } else if (week <= 4) {
          activity = `First fertilizer application`;
          icon = '🌿';
        } else if (week <= 8) {
          activity = `Regular watering and pest monitoring`;
          icon = '🔍';
        } else if (week <= 12) {
          activity = `Flowering stage care and second fertilizer application`;
          icon = '🌸';
        } else {
          activity = `Pre-harvest preparations`;
          icon = '🌾';
        }

        activities.push({
          week: week + 1,
          date: activityDate.toISOString().split('T')[0],
          activity,
          icon,
          crop: rec.crop,
          priority: week <= 2 || week >= 12 ? 'high' : 'medium'
        });
      }

      return {
        crop: rec.crop,
        variety: rec.variety,
        timeline: rec.timeline,
        activities
      };
    });

    res.json({
      success: true,
      message: 'Farming calendar generated successfully',
      data: {
        calendar,
        summary: {
          totalCrops: selectedRecommendations.length,
          totalWeeks: 16,
          startDate: Math.min(...selectedRecommendations.map(r =>
            new Date(r.timeline.sowingStart).getTime()
          )),
          endDate: Math.max(...selectedRecommendations.map(r =>
            new Date(r.timeline.harvestEnd).getTime()
          ))
        }
      }
    });

  } catch (error) {
    logger.error('Generate farming calendar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate farming calendar',
      error: 'CALENDAR_GENERATION_ERROR'
    });
  }
};
