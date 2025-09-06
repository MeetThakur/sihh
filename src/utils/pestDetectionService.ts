export interface PestAnalysisResult {
  pestType: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  characteristics: string[];
  treatments: string[];
  affectedCrops: string[];
  pestDetails: {
    scientificName: string;
    commonNames: string[];
    lifecycle: string;
    damageType: string;
  };
  preventiveMeasures: string[];
  urgencyLevel: 'Immediate' | 'Within 24 hours' | 'Within a week' | 'Monitor';
}

export const analyzePestImage = async (imageFile: File): Promise<PestAnalysisResult> => {
  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(imageFile);
    
    const prompt = `Analyze this image for pest identification and provide comprehensive pest management recommendations.

DETAILED PEST ANALYSIS REQUIREMENTS:

1. PEST IDENTIFICATION:
   - Identify the specific pest type (insects, diseases, fungal, bacterial, viral)
   - Provide scientific name and common names
   - Assess confidence level (0-100%)

2. SEVERITY ASSESSMENT:
   - Low: Minimal damage, early stage
   - Medium: Moderate damage, intervention needed
   - High: Significant damage, immediate action required
   - Critical: Severe infestation, crop loss imminent

3. DAMAGE ANALYSIS:
   - Type of damage (leaf damage, stem damage, root damage, fruit damage)
   - Stage of infestation (early, intermediate, advanced)
   - Visible symptoms and characteristics

4. TREATMENT RECOMMENDATIONS:
   - Immediate treatment options (organic and chemical)
   - Application methods and timing
   - Dosage recommendations
   - Safety precautions

5. PREVENTION STRATEGIES:
   - Cultural practices
   - Biological control methods
   - Integrated pest management approaches

COMMON PEST CATEGORIES TO IDENTIFY:
- INSECTS: Aphids, Whiteflies, Thrips, Caterpillars, Beetles, Borers
- DISEASES: Blight, Rust, Powdery Mildew, Bacterial Spot, Viral Infections
- FUNGAL: Leaf spots, Root rot, Wilt diseases
- MITES: Spider mites, Rust mites
- NEMATODES: Root-knot nematodes

Respond in JSON format:
{
  "pestType": "specific pest name",
  "confidence": number_0_to_100,
  "severity": "Low|Medium|High|Critical",
  "characteristics": ["visible_symptom1", "visible_symptom2", "visible_symptom3"],
  "treatments": ["treatment_option1", "treatment_option2", "treatment_option3"],
  "affectedCrops": ["crop1", "crop2", "crop3"],
  "pestDetails": {
    "scientificName": "Scientific name",
    "commonNames": ["common_name1", "common_name2"],
    "lifecycle": "lifecycle description",
    "damageType": "type of damage caused"
  },
  "preventiveMeasures": ["prevention1", "prevention2", "prevention3"],
  "urgencyLevel": "Immediate|Within 24 hours|Within a week|Monitor"
}`;

    const response = await askGeminiWithImage(prompt, base64Image);
    
    // Parse the JSON response
    let jsonString = response.trim();
    jsonString = jsonString.replace(/```json\s*/g, '').replace(/\s*```/g, '');
    
    const analysis = JSON.parse(jsonString);
    
    // Validate and sanitize the response
    const validSeverityLevels = ['Low', 'Medium', 'High', 'Critical'];
    if (!validSeverityLevels.includes(analysis.severity)) {
      analysis.severity = 'Medium'; // Default fallback
    }
    
    const validUrgencyLevels = ['Immediate', 'Within 24 hours', 'Within a week', 'Monitor'];
    if (!validUrgencyLevels.includes(analysis.urgencyLevel)) {
      analysis.urgencyLevel = 'Within 24 hours'; // Default fallback
    }
    
    // Ensure confidence is within valid range
    analysis.confidence = Math.max(0, Math.min(100, analysis.confidence || 70));
    
    // Ensure arrays exist
    analysis.characteristics = Array.isArray(analysis.characteristics) ? analysis.characteristics : ['Pest damage visible'];
    analysis.treatments = Array.isArray(analysis.treatments) ? analysis.treatments : ['Consult agricultural expert'];
    analysis.affectedCrops = Array.isArray(analysis.affectedCrops) ? analysis.affectedCrops : ['Multiple crops'];
    analysis.preventiveMeasures = Array.isArray(analysis.preventiveMeasures) ? analysis.preventiveMeasures : ['Regular monitoring'];
    
    // Ensure pest details exist
    if (!analysis.pestDetails) {
      analysis.pestDetails = {
        scientificName: 'Unknown species',
        commonNames: ['Unidentified pest'],
        lifecycle: 'Varies by species',
        damageType: 'Plant damage'
      };
    }
    
    return analysis;
    
  } catch (error) {
    console.error('Error analyzing pest image:', error);
    
    // Return default analysis on error
    return {
      pestType: 'Unidentified Pest',
      confidence: 50,
      severity: 'Medium',
      characteristics: ['Unable to analyze image clearly', 'Possible pest damage visible'],
      treatments: ['Consult local agricultural extension officer', 'Apply general insecticide if necessary'],
      affectedCrops: ['Multiple crops'],
      pestDetails: {
        scientificName: 'Unknown',
        commonNames: ['Unidentified'],
        lifecycle: 'Unknown',
        damageType: 'General plant damage'
      },
      preventiveMeasures: ['Regular field monitoring', 'Maintain field hygiene', 'Use resistant varieties'],
      urgencyLevel: 'Within 24 hours'
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
        maxOutputTokens: 2000,
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
