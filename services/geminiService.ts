import { GoogleGenerativeAI } from '@google/generative-ai';
import { southAfricanVenues, type Venue, type Store } from '@/data/southAfricanVenues';

interface ChatContext {
  venueId?: string;
  venueName?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  previousMessages?: string[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private initialized = false;
  private responseCache = new Map<string, { response: string; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    try {
      // In production, you would use a secure API key management system
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'demo-key';
      
      if (apiKey === 'demo-key') {
        console.warn('Using demo mode - Gemini API key not configured');
        this.initialized = false;
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.initialized = true;
      console.log('GeminiService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize GeminiService:', error);
      this.initialized = false;
    }
  }

  private getVenueContext(venueId?: string): string {
    if (!venueId) {
      return this.getGeneralVenueContext();
    }

    const venue = southAfricanVenues.find(v => v.id === venueId);
    if (!venue) {
      return this.getGeneralVenueContext();
    }

    return `
**Current Venue:** ${venue.name}
**Location:** ${venue.location.city}, ${venue.location.province}
**Type:** ${venue.type}
**Description:** ${venue.description}
**Features:** ${venue.features.join(', ')}
**Rating:** ${venue.rating}/5
**Hours:** ${venue.openingHours}
${venue.zones ? `**Zones:** ${venue.zones.join(', ')}` : ''}
${venue.levels ? `**Levels:** ${venue.levels} floors` : ''}
${venue.accessibility ? `**Accessibility:** ${venue.accessibility.join(', ')}` : ''}
${venue.parkingInfo ? `**Parking:** ${venue.parkingInfo.capacity} spaces, ${venue.parkingInfo.pricing}` : ''}
${venue.stores ? `**Key Stores:** ${venue.stores.slice(0, 10).map(s => `${s.name} (Level ${s.level})`).join(', ')}` : ''}
    `.trim();
  }

  private getGeneralVenueContext(): string {
    const topVenues = southAfricanVenues.slice(0, 5);
    return `
**Available South African Venues:**
${topVenues.map(venue => 
  `• ${venue.name} (${venue.location.city}) - ${venue.type} - Rating: ${venue.rating}/5`
).join('\n')}

**Popular Categories:**
• Shopping Malls (Sandton City, V&A Waterfront, Gateway Theatre)
• Airports (OR Tambo, Cape Town International)
• Stadiums (FNB Stadium, DHL Stadium)
• Universities (Wits, UCT, UKZN)
    `.trim();
  }

  private getSystemPrompt(context: ChatContext): string {
    const venueContext = this.getVenueContext(context.venueId);
    
    return `
You are NaviGenie, an intelligent AI assistant for NaviLynx - South Africa's premier indoor navigation app. You help users navigate venues, find stores, get information about prices, promotions, and provide concierge services.

**Your Role:**
- Indoor navigation expert for South African venues
- Shopping and dining advisor with local knowledge
- Helpful concierge providing venue information
- Price comparison and deal finder
- Accessibility and service information provider

**Key Capabilities:**
- Help users find specific stores, restaurants, services
- Provide navigation directions within venues
- Share store hours, contact information, and services
- Offer price comparisons and current promotions
- Suggest alternatives based on user preferences
- Assist with accessibility needs
- Recommend nearby amenities (parking, restrooms, ATMs)

**Communication Style:**
- Friendly, helpful, and professional
- Use South African context and local knowledge
- Be concise but comprehensive
- Always offer to help with navigation or additional questions
- Use local currency (Rand) and familiar South African terms

**Current Context:**
${venueContext}

**Important Guidelines:**
- Always prioritize user safety and accessibility
- Provide accurate, up-to-date information when possible
- If you don't have specific information, suggest how users can find it
- Offer to help with navigation to any mentioned locations
- Be culturally aware and use appropriate South African context

Respond naturally as if you're a knowledgeable local assistant helping visitors navigate South African venues.
    `.trim();
  }

  private getDemoResponse(message: string, context: ChatContext): string {
    const lowerMessage = message.toLowerCase();

    // Navigation queries
    if (lowerMessage.includes('where') || lowerMessage.includes('find') || lowerMessage.includes('navigate')) {
      return `I'd be happy to help you navigate! ${context.venueName ? `At ${context.venueName}` : 'In this venue'}, I can guide you to specific stores, restaurants, or services. What are you looking for?

Some popular destinations include:
🛍️ Fashion stores
🍽️ Food court & restaurants  
🏧 ATMs & banking
🚻 Restrooms
🎬 Entertainment areas

Just let me know where you'd like to go and I'll provide turn-by-turn directions!`;
    }

    // Store/shopping queries
    if (lowerMessage.includes('store') || lowerMessage.includes('shop') || lowerMessage.includes('buy')) {
      return `Looking for stores? ${context.venueName ? `${context.venueName}` : 'This venue'} has many options! Here are some popular categories:

👗 **Fashion & Clothing**
📱 **Electronics & Tech**
🍕 **Food & Dining**
💄 **Beauty & Health**
🏠 **Home & Lifestyle**

What type of store are you looking for? I can help you find the best options and guide you there!`;
    }

    // Price queries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('deal')) {
      return `Great question about pricing! While I don't have real-time prices, I can help you:

💰 Find stores with current promotions
🏷️ Locate discount outlets and sales
💳 Guide you to price comparison apps
🛒 Suggest budget-friendly alternatives

Would you like me to help you find specific stores or current deals in the area?`;
    }

    // Parking queries
    if (lowerMessage.includes('park') || lowerMessage.includes('car')) {
      const venue = context.venueId ? southAfricanVenues.find(v => v.id === context.venueId) : null;
      if (venue?.parkingInfo) {
        return `🚗 **Parking Information:**

📍 **Capacity:** ${venue.parkingInfo.capacity} spaces
💵 **Pricing:** ${venue.parkingInfo.pricing}
🏢 **Levels:** ${venue.parkingInfo.levels} parking levels

I can help guide you to the nearest available parking area or to your car when you're ready to leave!`;
      }
      return `I can help you with parking! Most venues have multiple parking levels with clear signage. Would you like directions to the parking areas or help finding your car?`;
    }

    // General greeting or help
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      return `Hello! I'm NaviGenie, your AI assistant for ${context.venueName || 'this venue'}. I'm here to help you with:

🗺️ **Navigation** - Find any store or service
🛍️ **Shopping** - Discover stores and deals  
🍽️ **Dining** - Locate restaurants and food options
🚗 **Services** - Parking, ATMs, restrooms, accessibility
ℹ️ **Information** - Hours, contact details, amenities

What can I help you with today?`;
    }

    // Default helpful response
    return `I understand you're asking about "${message}". I'm here to help with navigation, shopping, dining, and venue information at ${context.venueName || 'this location'}.

Could you be more specific about what you're looking for? For example:
• "Where is the food court?"
• "Find electronics stores"  
• "Show me parking information"
• "What restaurants are on level 2?"

I'm ready to help guide you anywhere you need to go! 🗺️`;
  }

  async getChatbotResponse(message: string, context: ChatContext = {}): Promise<string> {
    try {
      // Create cache key from message and context
      const cacheKey = this.createCacheKey(message, context);
      
      // Check cache first
      const cachedResponse = this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        console.log('Returning cached response');
        return cachedResponse;
      }

      if (!this.initialized || !this.model) {
        console.log('Using demo mode for chat response');
        const demoResponse = this.getDemoResponse(message, context);
        this.setCachedResponse(cacheKey, demoResponse);
        return demoResponse;
      }

      const systemPrompt = this.getSystemPrompt(context);
      const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nNaviGenie:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      const finalResponse = text.trim();
      this.setCachedResponse(cacheKey, finalResponse);
      return finalResponse;
    } catch (error) {
      console.error('Gemini API error:', error);
      console.log('Falling back to demo response');
      const fallbackResponse = this.getDemoResponse(message, context);
      
      // Cache fallback response with shorter duration
      const cacheKey = this.createCacheKey(message, context);
      this.setCachedResponse(cacheKey, fallbackResponse, 60000); // 1 minute for fallbacks
      
      return fallbackResponse;
    }
  }

  async getVenueRecommendations(userPreferences: string[], location?: { latitude: number; longitude: number }): Promise<Venue[]> {
    try {
      // Sort venues by proximity if location is provided
      let venues = [...southAfricanVenues];
      
      if (location) {
        venues = venues.sort((a, b) => {
          const distanceA = this.calculateDistance(
            location.latitude, 
            location.longitude,
            a.location.coordinates.latitude,
            a.location.coordinates.longitude
          );
          const distanceB = this.calculateDistance(
            location.latitude,
            location.longitude,
            b.location.coordinates.latitude,
            b.location.coordinates.longitude
          );
          return distanceA - distanceB;
        });
      }

      // Filter by preferences if provided
      if (userPreferences.length > 0) {
        venues = venues.filter(venue => 
          userPreferences.some(pref => 
            venue.features.some(feature => 
              feature.toLowerCase().includes(pref.toLowerCase())
            ) ||
            venue.type.toLowerCase().includes(pref.toLowerCase()) ||
            venue.name.toLowerCase().includes(pref.toLowerCase())
          )
        );
      }

      return venues.slice(0, 10); // Return top 10 matches
    } catch (error) {
      console.error('Error getting venue recommendations:', error);
      return southAfricanVenues.slice(0, 5); // Fallback to top 5 venues
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  async getStoreInformation(storeName: string, venueId?: string): Promise<Store | null> {
    try {
      let searchVenues = venueId 
        ? southAfricanVenues.filter(v => v.id === venueId)
        : southAfricanVenues;

      for (const venue of searchVenues) {
        if (venue.stores) {
          const store = venue.stores.find(s => 
            s.name.toLowerCase().includes(storeName.toLowerCase())
          );
          if (store) {
            return store;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting store information:', error);
      return null;
    }
  }

  /**
   * Analyze object from image using Gemini Vision API
   */
  async analyzeObject(base64Image: string): Promise<{
    name: string;
    description: string;
    category: string;
    confidence: number;
    suggestions: string[];
    estimatedPrice?: string;
    nearbyStores?: string[];
  }> {
    try {
      if (!this.genAI) {
        await this.initializeService();
      }

      if (!this.genAI) {
        throw new Error('Gemini AI not initialized');
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

      const prompt = `Analyze this image and identify the main object. Provide:
1. Object name
2. Brief description
3. Category (electronics, clothing, food, etc.)
4. Confidence level (0-1)
5. Shopping suggestions or similar items
6. Estimated price range (optional)
7. Nearby stores that might sell this (optional)

Format as JSON with fields: name, description, category, confidence, suggestions (array of strings), estimatedPrice (optional string), nearbyStores (optional array of strings)`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg'
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      try {
        const parsed = JSON.parse(text);
        return {
          name: parsed.name || 'Unknown Object',
          description: parsed.description || 'Unable to identify object',
          category: parsed.category || 'unknown',
          confidence: parsed.confidence || 0.5,
          suggestions: parsed.suggestions || ['Try taking a clearer photo'],
          estimatedPrice: parsed.estimatedPrice || 'Unknown',
          nearbyStores: parsed.nearbyStores || ['General electronics store', 'Department store'],
        };
      } catch {
        // Fallback if JSON parsing fails
        return {
          name: 'Scanned Object',
          description: text.substring(0, 200),
          category: 'unknown',
          confidence: 0.7,
          suggestions: ['Check nearby stores for similar items'],
          estimatedPrice: 'Unknown',
          nearbyStores: ['General store'],
        };
      }

    } catch (error) {
      console.error('Object analysis error:', error);
      return {
        name: 'Unknown Object',
        description: 'Unable to analyze image. Please try again.',
        category: 'unknown',
        confidence: 0,
        suggestions: ['Ensure good lighting and clear focus'],
        estimatedPrice: 'Unknown',
        nearbyStores: ['Try a general store'],
      };
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async reinitialize(): Promise<void> {
    await this.initializeService();
  }

  /**
   * Cache utility methods for performance optimization
   */
  private createCacheKey(message: string, context: ChatContext): string {
    const contextKey = JSON.stringify({
      venueId: context.venueId,
      venueName: context.venueName,
      hasLocation: !!context.userLocation,
    });
    return `${message.toLowerCase().trim()}_${contextKey}`;
  }

  private getCachedResponse(key: string): string | null {
    const cached = this.responseCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.responseCache.delete(key);
      return null;
    }

    return cached.response;
  }

  private setCachedResponse(key: string, response: string, duration?: number): void {
    this.responseCache.set(key, {
      response,
      timestamp: Date.now(),
    });

    // Clean up old cache entries periodically
    if (this.responseCache.size > 100) {
      this.cleanupCache();
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.responseCache.forEach((value, key) => {
      if (now - value.timestamp > this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.responseCache.delete(key));
    console.log(`Cleaned up ${keysToDelete.length} expired cache entries`);
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;
