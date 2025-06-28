
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface SmartSearchResult {
  venues: {
    name: string;
    category: string;
    description: string;
    location: string;
    priceRange: string;
    rating: number;
    distance: string;
  }[];
  suggestions: string[];
  filters: {
    type: string;
    options: string[];
  }[];
}

interface ObjectAnalysisResult {
  name: string;
  description: string;
  category: string;
  estimatedPrice: string;
  nearbyStores: string[];
  confidence: number;
  alternatives: string[];
}

class GeminiService {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    // In production, this should come from environment variables
    this.apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || null;
  }

  async smartSearch(query: string, location?: string): Promise<SmartSearchResult> {
    try {
      const prompt = `
        You are a smart shopping assistant for South African malls and venues. 
        
        User query: "${query}"
        ${location ? `Current location: ${location}` : ''}
        
        Provide shopping recommendations for South African venues like:
        - Sandton City Mall
        - Canal Walk Shopping Centre
        - Gateway Theatre of Shopping
        - V&A Waterfront
        - Menlyn Park Shopping Centre
        
        Return a JSON response with:
        1. "venues" array with relevant stores/restaurants
        2. "suggestions" array with helpful search suggestions
        3. "filters" array with filtering options
        
        Focus on South African brands and price ranges in ZAR.
      `;

      const response = await this.callGemini(prompt);
      
      if (response) {
        try {
          return JSON.parse(response);
        } catch {
          return this.getFallbackSearchResults(query);
        }
      }
      
      return this.getFallbackSearchResults(query);
    } catch (error) {
      console.error('Smart search error:', error);
      return this.getFallbackSearchResults(query);
    }
  }

  async analyzeObject(imageBase64: string): Promise<ObjectAnalysisResult> {
    try {
      const prompt = `
        Analyze this image and identify the main object. 
        
        Provide information relevant to South African shopping:
        - Object name and description
        - Category
        - Estimated price range in ZAR
        - Where to buy it in South African stores
        - Confidence level (0-1)
        - Alternative similar products
        
        Return as JSON with keys: name, description, category, estimatedPrice, nearbyStores, confidence, alternatives
      `;

      const response = await this.callGeminiVision(prompt, imageBase64);
      
      if (response) {
        try {
          return JSON.parse(response);
        } catch {
          return this.getFallbackObjectAnalysis();
        }
      }
      
      return this.getFallbackObjectAnalysis();
    } catch (error) {
      console.error('Object analysis error:', error);
      return this.getFallbackObjectAnalysis();
    }
  }

  async getChatbotResponse(message: string, context?: string): Promise<string> {
    try {
      const prompt = `
        You are NaviLynx AI Assistant, helping users navigate South African malls and venues.
        
        ${context ? `Context: ${context}` : ''}
        User message: "${message}"
        
        Provide helpful, friendly responses about:
        - Navigation and directions
        - Store locations and hours
        - Product recommendations
        - Mall amenities (toilets, parking, ATMs)
        - South African shopping culture
        - Price comparisons in ZAR
        
        Keep responses concise and helpful.
      `;

      const response = await this.callGemini(prompt);
      return response || "I'm here to help you navigate and find what you're looking for! Could you please rephrase your question?";
    } catch (error) {
      console.error('Chatbot error:', error);
      return "I'm experiencing some technical difficulties. Please try again in a moment.";
    }
  }

  private async callGemini(prompt: string): Promise<string | null> {
    if (!this.apiKey) {
      console.warn('Gemini API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      return null;
    }
  }

  private async callGeminiVision(prompt: string, imageBase64: string): Promise<string | null> {
    if (!this.apiKey) {
      console.warn('Gemini API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro-vision:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: imageBase64,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini Vision API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
      console.error('Gemini Vision API call failed:', error);
      return null;
    }
  }

  private getFallbackSearchResults(query: string): SmartSearchResult {
    return {
      venues: [
        {
          name: 'Sportscene',
          category: 'Footwear & Sportswear',
          description: 'Popular South African sports retailer',
          location: 'Level 2, Sandton City',
          priceRange: 'R200 - R3,000',
          rating: 4.2,
          distance: '150m',
        },
        {
          name: 'Mr Price',
          category: 'Fashion & Lifestyle',
          description: 'Affordable fashion and home goods',
          location: 'Level 1, Canal Walk',
          priceRange: 'R50 - R800',
          rating: 4.0,
          distance: '300m',
        },
        {
          name: 'Woolworths',
          category: 'Food & Fashion',
          description: 'Premium South African retailer',
          location: 'Ground Floor, V&A Waterfront',
          priceRange: 'R100 - R2,000',
          rating: 4.5,
          distance: '200m',
        },
      ],
      suggestions: [
        'Sneakers under R1000',
        'Local South African brands',
        'Stores open late',
        'Best deals this week',
      ],
      filters: [
        {
          type: 'Price Range',
          options: ['Under R200', 'R200-R500', 'R500-R1000', 'Over R1000'],
        },
        {
          type: 'Category',
          options: ['Fashion', 'Electronics', 'Food', 'Home & Garden'],
        },
      ],
    };
  }

  private getFallbackObjectAnalysis(): ObjectAnalysisResult {
    return {
      name: 'Unidentified Object',
      description: 'Could not identify the object clearly. Please try taking another photo with better lighting.',
      category: 'Unknown',
      estimatedPrice: 'N/A',
      nearbyStores: [],
      confidence: 0.1,
      alternatives: [],
    };
  }
}

export const geminiService = new GeminiService();
export type { SmartSearchResult, ObjectAnalysisResult };
