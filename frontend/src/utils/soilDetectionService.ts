export interface SoilAnalysisResult {
  soilType: 'clay' | 'loam' | 'sandy' | 'silt' | 'mixed';
  confidence: number;
  characteristics: string[];
  recommendations: string[];
  color: string;
  texture: string;
  colorAnalysis: {
    primaryColor: string;
    organicMatter: 'high' | 'medium' | 'low';
    moistureLevel: 'wet' | 'moist' | 'dry';
    fertility: 'high' | 'medium' | 'low';
  };
  textureAnalysis: {
    particleSize: 'fine' | 'medium' | 'coarse' | 'mixed';
    drainage: 'excellent' | 'good' | 'moderate' | 'poor';
    compaction: 'loose' | 'moderate' | 'compacted';
    porosity: 'high' | 'medium' | 'low';
  };
}

export const analyzeSoilImage = async (imageFile: File): Promise<SoilAnalysisResult> => {
  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(imageFile);
    
    const prompt = `Analyze this soil image and provide comprehensive soil analysis based on color and texture characteristics.

DETAILED ANALYSIS REQUIREMENTS:

1. SOIL TYPE IDENTIFICATION:
   - Primary type: clay, loam, sandy, silt, or mixed
   - Based on visible particle size, aggregation, and structure

2. COLOR ANALYSIS:
   - Primary color description (e.g., "dark brown", "reddish-brown", "black", "gray", "yellowish")
   - Organic matter content based on color darkness (dark = high organic matter)
   - Moisture level assessment from color saturation
   - Fertility indication from color richness

3. TEXTURE ANALYSIS:
   - Particle size assessment (fine/medium/coarse/mixed)
   - Surface smoothness or roughness
   - Clumping and aggregation patterns
   - Drainage capability based on texture
   - Soil compaction level
   - Porosity assessment

4. PHYSICAL CHARACTERISTICS:
   - Visible cracks, clods, or structure
   - Surface conditions (smooth, rough, granular)
   - Moisture retention capability
   - Root penetration ease

SOIL TYPE CRITERIA (analyze carefully):
- CLAY: Very fine particles, sticky when wet, cracks when dry, dark colors, poor drainage
- LOAM: Balanced texture, medium brown colors, crumbly structure, good drainage
- SANDY: Coarse particles visible, light colors, loose structure, excellent drainage
- SILT: Smooth fine texture, moderate colors, holds shape moderately, fair drainage
- MIXED: Combination of particle sizes, varied colors, complex structure

Respond in JSON format:
{
  "soilType": "clay|loam|sandy|silt|mixed",
  "confidence": number_0_to_100,
  "characteristics": ["detailed_characteristic1", "detailed_characteristic2", "detailed_characteristic3"],
  "recommendations": ["farming_recommendation1", "farming_recommendation2"],
  "color": "detailed color description",
  "texture": "detailed texture description",
  "colorAnalysis": {
    "primaryColor": "specific color name",
    "organicMatter": "high|medium|low",
    "moistureLevel": "wet|moist|dry",
    "fertility": "high|medium|low"
  },
  "textureAnalysis": {
    "particleSize": "fine|medium|coarse|mixed",
    "drainage": "excellent|good|moderate|poor",
    "compaction": "loose|moderate|compacted",
    "porosity": "high|medium|low"
  }
}`;

    const response = await askGeminiWithImage(prompt, base64Image);
    
    // Parse the JSON response
    let jsonString = response.trim();
    jsonString = jsonString.replace(/```json\s*/g, '').replace(/\s*```/g, '');
    
    const analysis = JSON.parse(jsonString);
    
    // Validate and sanitize the response
    const validSoilTypes = ['clay', 'loam', 'sandy', 'silt', 'mixed'];
    if (!validSoilTypes.includes(analysis.soilType)) {
      analysis.soilType = 'loam'; // Default fallback
    }
    
    // Ensure confidence is within valid range
    analysis.confidence = Math.max(0, Math.min(100, analysis.confidence || 75));
    
    // Ensure arrays exist and add default analysis objects
    analysis.characteristics = Array.isArray(analysis.characteristics) ? analysis.characteristics : ['Standard soil properties'];
    analysis.recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : ['Follow standard farming practices'];
    
    // Ensure color and texture analysis exist
    if (!analysis.colorAnalysis) {
      analysis.colorAnalysis = {
        primaryColor: 'Brown',
        organicMatter: 'medium',
        moistureLevel: 'moist',
        fertility: 'medium'
      };
    }
    
    if (!analysis.textureAnalysis) {
      analysis.textureAnalysis = {
        particleSize: 'medium',
        drainage: 'good',
        compaction: 'moderate',
        porosity: 'medium'
      };
    }
    
    return analysis;
    
  } catch (error) {
    console.error('Error analyzing soil image:', error);
    
    // Return default analysis on error
    return {
      soilType: 'loam',
      confidence: 60,
      characteristics: ['Unable to analyze image clearly', 'Appears to be standard agricultural soil'],
      recommendations: ['Consider soil testing for accurate analysis', 'Follow general farming practices'],
      color: 'Medium brown',
      texture: 'Mixed texture',
      colorAnalysis: {
        primaryColor: 'Medium brown',
        organicMatter: 'medium',
        moistureLevel: 'moist',
        fertility: 'medium'
      },
      textureAnalysis: {
        particleSize: 'medium',
        drainage: 'good',
        compaction: 'moderate',
        porosity: 'medium'
      }
    };
  }
};

// Helper function to convert image file to base64
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        // Remove the data URL prefix to get pure base64
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsDataURL(file);
  });
};

// Function to call Gemini with image
const askGeminiWithImage = async (prompt: string, base64Image: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1000,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Unexpected response format from Gemini API');
  }
};
