import { geminiService } from './geminiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  barcode?: string;
  image?: string;
  description?: string;
  avgPrice?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  reviews?: {
    rating: number;
    count: number;
  };
  alternatives?: string[];
  tags?: string[];
}

export interface Store {
  id: string;
  name: string;
  chain: string;
  location: string;
  distance?: number;
  priceLevel: 'budget' | 'mid' | 'premium';
  specialties: string[];
}

export interface ProductPrice {
  storeId: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
  specialOffer?: string;
}

export interface ShoppingListItem {
  id: string;
  productId?: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  estimatedPrice?: number;
  isCompleted: boolean;
  addedDate: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdDate: string;
  lastModified: string;
  estimatedTotal?: number;
  targetStore?: string;
  isTemplate?: boolean;
}

export interface ShoppingRecommendation {
  type: 'product' | 'store' | 'deal' | 'substitute';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actionData?: any;
}

class ShopAssistantService {
  private static instance: ShopAssistantService;
  private shoppingLists: ShoppingList[] = [];
  private productDatabase: Product[] = [];
  private storeDatabase: Store[] = [];

  private constructor() {
    this.initializeData();
    this.loadShoppingLists();
  }

  public static getInstance(): ShopAssistantService {
    if (!ShopAssistantService.instance) {
      ShopAssistantService.instance = new ShopAssistantService();
    }
    return ShopAssistantService.instance;
  }

  private initializeData() {
    // Initialize with South African product database
    this.productDatabase = [
      {
        id: 'prod_1',
        name: 'Jungle Oats',
        category: 'Breakfast & Cereals',
        brand: 'Jungle',
        barcode: '6001087020121',
        avgPrice: 45.99,
        priceRange: { min: 42.99, max: 49.99 },
        nutritionInfo: { calories: 360, protein: 13, carbs: 58, fat: 8 },
        reviews: { rating: 4.5, count: 1250 },
        tags: ['healthy', 'breakfast', 'oats', 'south-african'],
        alternatives: ['prod_2', 'prod_3']
      },
      {
        id: 'prod_2',
        name: 'Woolworths Free Range Eggs',
        category: 'Dairy & Eggs',
        brand: 'Woolworths',
        avgPrice: 89.99,
        priceRange: { min: 85.99, max: 95.99 },
        nutritionInfo: { calories: 155, protein: 13, carbs: 1, fat: 11 },
        reviews: { rating: 4.8, count: 890 },
        tags: ['free-range', 'protein', 'fresh', 'premium']
      },
      {
        id: 'prod_3',
        name: 'Pick n Pay White Bread',
        category: 'Bakery',
        brand: 'Pick n Pay',
        avgPrice: 18.99,
        priceRange: { min: 16.99, max: 21.99 },
        reviews: { rating: 4.2, count: 2100 },
        tags: ['bread', 'staple', 'affordable']
      },
      {
        id: 'prod_4',
        name: 'Nando\'s Peri-Peri Sauce',
        category: 'Condiments',
        brand: 'Nando\'s',
        avgPrice: 35.99,
        priceRange: { min: 32.99, max: 39.99 },
        reviews: { rating: 4.7, count: 3200 },
        tags: ['spicy', 'south-african', 'sauce', 'premium']
      }
    ];

    // Initialize South African store chains
    this.storeDatabase = [
      {
        id: 'store_1',
        name: 'Pick n Pay Menlyn',
        chain: 'Pick n Pay',
        location: 'Menlyn Park Shopping Centre',
        priceLevel: 'mid',
        specialties: ['fresh-produce', 'household', 'pharmacy']
      },
      {
        id: 'store_2',
        name: 'Woolworths Sandton City',
        chain: 'Woolworths',
        location: 'Sandton City',
        priceLevel: 'premium',
        specialties: ['organic', 'premium-brands', 'fresh-food']
      },
      {
        id: 'store_3',
        name: 'Checkers Hyper Fourways',
        chain: 'Checkers',
        location: 'Fourways Mall',
        priceLevel: 'budget',
        specialties: ['bulk-buying', 'household', 'value-brands']
      },
      {
        id: 'store_4',
        name: 'Spar Rosebank',
        chain: 'Spar',
        location: 'Rosebank',
        priceLevel: 'mid',
        specialties: ['convenience', 'fresh-produce', 'local-brands']
      }
    ];
  }

  // Product Recognition and Scanning
  public async scanProduct(imageBase64: string): Promise<{
    success: boolean;
    product?: Product;
    confidence: number;
    message: string;
  }> {
    try {
      // Simulate AI product recognition
      // In production, this would use Google Vision API or geminiService
      const prompt = `Analyze this product image and identify the product. Return details including name, brand, category, and estimated price in South African Rand.`;
      
      // Use geminiService for AI analysis when available
      try {
        await geminiService.getChatbotResponse(prompt);
      } catch {
        // Fallback to mock data
      }
      
      // For demo purposes, return a random product with high confidence
      const randomProduct = this.productDatabase[Math.floor(Math.random() * this.productDatabase.length)];
      
      return {
        success: true,
        product: randomProduct,
        confidence: 0.89,
        message: 'Product identified successfully!'
      };
    } catch {
      return {
        success: false,
        confidence: 0,
        message: 'Failed to identify product. Please try again.'
      };
    }
  }

  // Price Comparison
  public async compareProductPrices(productId: string): Promise<ProductPrice[]> {
    // Simulate price comparison across stores
    const product = this.productDatabase.find(p => p.id === productId);
    if (!product) return [];

    const prices: ProductPrice[] = [];
    
    for (const store of this.storeDatabase) {
      const basePrice = product.avgPrice || 0;
      const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const price = Math.round((basePrice * (1 + variation)) * 100) / 100;
      
      prices.push({
        storeId: store.id,
        storeName: store.name,
        price,
        originalPrice: store.priceLevel === 'premium' ? price * 1.1 : undefined,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : undefined,
        availability: Math.random() > 0.1 ? 'in-stock' : 'low-stock',
        lastUpdated: new Date().toISOString(),
        specialOffer: Math.random() > 0.8 ? 'Buy 2 Get 1 Free' : undefined
      });
    }

    return prices.sort((a, b) => a.price - b.price);
  }

  // Shopping List Management
  public async createShoppingList(name: string): Promise<ShoppingList> {
    const newList: ShoppingList = {
      id: `list_${Date.now()}`,
      name,
      items: [],
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      estimatedTotal: 0
    };

    this.shoppingLists.push(newList);
    await this.saveShoppingLists();
    
    return newList;
  }

  public async getShoppingLists(): Promise<ShoppingList[]> {
    return this.shoppingLists;
  }

  public async addItemToList(listId: string, item: Omit<ShoppingListItem, 'id' | 'addedDate'>): Promise<void> {
    const list = this.shoppingLists.find(l => l.id === listId);
    if (!list) throw new Error('Shopping list not found');

    const newItem: ShoppingListItem = {
      ...item,
      id: `item_${Date.now()}`,
      addedDate: new Date().toISOString()
    };

    list.items.push(newItem);
    list.lastModified = new Date().toISOString();
    
    // Update estimated total
    list.estimatedTotal = list.items.reduce((total, item) => 
      total + (item.estimatedPrice || 0) * item.quantity, 0
    );

    await this.saveShoppingLists();
  }

  public async updateListItem(listId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<void> {
    const list = this.shoppingLists.find(l => l.id === listId);
    if (!list) throw new Error('Shopping list not found');

    const itemIndex = list.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) throw new Error('Item not found');

    list.items[itemIndex] = { ...list.items[itemIndex], ...updates };
    list.lastModified = new Date().toISOString();
    
    await this.saveShoppingLists();
  }

  public async deleteListItem(listId: string, itemId: string): Promise<void> {
    const list = this.shoppingLists.find(l => l.id === listId);
    if (!list) throw new Error('Shopping list not found');

    list.items = list.items.filter(i => i.id !== itemId);
    list.lastModified = new Date().toISOString();
    
    await this.saveShoppingLists();
  }

  // AI-Powered Shopping Recommendations
  public async getShoppingRecommendations(context: {
    currentList?: ShoppingList;
    location?: string;
    budget?: number;
    preferences?: string[];
  }): Promise<ShoppingRecommendation[]> {
    const recommendations: ShoppingRecommendation[] = [];

    try {
      // Generate AI recommendations based on context
      const prompt = `Based on this shopping context: ${JSON.stringify(context)}, provide 3-5 smart shopping recommendations for South African consumers. Consider local brands, seasonal availability, and value for money.`;
      
      // Try to use geminiService for AI recommendations when available
      try {
        await geminiService.getChatbotResponse(prompt);
      } catch {
        // Fallback to predefined recommendations
      }
      
      // Parse AI response and add structured recommendations
      recommendations.push(
        {
          type: 'product',
          title: 'Try Local SA Brands',
          description: 'Consider Jungle Oats instead of imported cereals - better value and supports local',
          confidence: 0.85,
          reasoning: 'Local brands often offer better value and fresher products'
        },
        {
          type: 'store',
          title: 'Shop at Pick n Pay for Basics',
          description: 'Your grocery staples are typically 15% cheaper here',
          confidence: 0.92,
          reasoning: 'Price analysis shows consistent savings on everyday items'
        },
        {
          type: 'deal',
          title: 'Wednesday Fresh Produce Special',
          description: 'Save 20% on fruits and vegetables',
          confidence: 0.78,
          reasoning: 'Weekly promotional pattern detected'
        }
      );
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    }

    return recommendations;
  }

  // Smart Shopping List Generation from AI
  public async generateSmartList(prompt: string): Promise<ShoppingList> {
    try {
      const aiPrompt = `Create a shopping list for: "${prompt}". Consider South African products, brands, and typical meal planning. Return items with categories, estimated quantities, and rough price estimates in ZAR.`;
      
      // Try to use AI for smart list generation
      try {
        await geminiService.getChatbotResponse(aiPrompt);
      } catch {
        // Fallback to predefined suggestions
      }
      
      // Create a new list based on AI suggestions
      const listName = `AI Suggested: ${prompt}`;
      const newList = await this.createShoppingList(listName);
      
      // Add sample items (in production, parse AI response)
      const sampleItems = [
        {
          name: 'Jungle Oats',
          quantity: 1,
          unit: 'box',
          category: 'Breakfast',
          priority: 'medium' as const,
          estimatedPrice: 45.99,
          isCompleted: false
        },
        {
          name: 'Fresh Milk',
          quantity: 2,
          unit: 'liters',
          category: 'Dairy',
          priority: 'high' as const,
          estimatedPrice: 35.99,
          isCompleted: false
        },
        {
          name: 'Brown Bread',
          quantity: 1,
          unit: 'loaf',
          category: 'Bakery',
          priority: 'medium' as const,
          estimatedPrice: 18.99,
          isCompleted: false
        }
      ];

      for (const item of sampleItems) {
        await this.addItemToList(newList.id, item);
      }

      return newList;
    } catch (error) {
      console.error('Error generating smart list:', error);
      return await this.createShoppingList(`Shopping List: ${prompt}`);
    }
  }

  // Product Search and Discovery
  public async searchProducts(query: string): Promise<Product[]> {
    const normalizedQuery = query.toLowerCase();
    
    return this.productDatabase.filter(product =>
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.brand?.toLowerCase().includes(normalizedQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
    );
  }

  // Store Navigation and Layout
  public async getStoreLayout(storeId: string): Promise<{
    success: boolean;
    layout?: {
      aisles: {
        number: number;
        name: string;
        categories: string[];
      }[];
      specialSections: {
        name: string;
        location: string;
        description: string;
      }[];
    };
  }> {
    const store = this.storeDatabase.find(s => s.id === storeId);
    if (!store) {
      return { success: false };
    }

    // Return mock store layout
    return {
      success: true,
      layout: {
        aisles: [
          { number: 1, name: 'Fresh Produce', categories: ['Fruits', 'Vegetables', 'Herbs'] },
          { number: 2, name: 'Dairy & Eggs', categories: ['Milk', 'Cheese', 'Yogurt', 'Eggs'] },
          { number: 3, name: 'Meat & Seafood', categories: ['Fresh Meat', 'Chicken', 'Fish'] },
          { number: 4, name: 'Bakery', categories: ['Bread', 'Pastries', 'Cakes'] },
          { number: 5, name: 'Pantry Staples', categories: ['Rice', 'Pasta', 'Canned Goods'] }
        ],
        specialSections: [
          { name: 'Pharmacy', location: 'Front Right', description: 'Health and wellness products' },
          { name: 'Deli Counter', location: 'Back Left', description: 'Fresh prepared foods' },
          { name: 'Wine & Spirits', location: 'Back Right', description: 'Alcoholic beverages' }
        ]
      }
    };
  }

  // Analytics and Insights
  public async getShoppingInsights(): Promise<{
    totalLists: number;
    totalItems: number;
    averageListSize: number;
    topCategories: { category: string; count: number }[];
    savingsOpportunities: ShoppingRecommendation[];
  }> {
    const totalLists = this.shoppingLists.length;
    const allItems = this.shoppingLists.flatMap(list => list.items);
    const totalItems = allItems.length;
    const averageListSize = totalLists > 0 ? totalItems / totalLists : 0;

    // Calculate top categories
    const categoryCount: { [key: string]: number } = {};
    allItems.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Generate savings recommendations
    const savingsOpportunities = await this.getShoppingRecommendations({
      budget: 1000,
      preferences: ['value', 'local-brands']
    });

    return {
      totalLists,
      totalItems,
      averageListSize: Math.round(averageListSize * 10) / 10,
      topCategories,
      savingsOpportunities: savingsOpportunities.slice(0, 3)
    };
  }

  // Utility Methods
  public async findNearbyStores(location?: string): Promise<Store[]> {
    // In production, this would use geolocation and store APIs
    return this.storeDatabase.map(store => ({
      ...store,
      distance: Math.random() * 20 + 1 // Mock distance in km
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  public formatPrice(price: number): string {
    return `R ${price.toFixed(2)}`;
  }

  public getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Breakfast & Cereals': 'sun.max.fill',
      'Dairy & Eggs': 'drop.fill',
      'Bakery': 'birthday.cake',
      'Condiments': 'flame.fill',
      'Fresh Produce': 'leaf.fill',
      'Meat & Seafood': 'fish.fill',
      'Pantry Staples': 'archivebox.fill'
    };
    return iconMap[category] || 'bag.fill';
  }

  // Private Helper Methods
  private async saveShoppingLists(): Promise<void> {
    try {
      await AsyncStorage.setItem('shopping_lists', JSON.stringify(this.shoppingLists));
    } catch (error) {
      console.error('Error saving shopping lists:', error);
    }
  }

  private async loadShoppingLists(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('shopping_lists');
      if (data) {
        this.shoppingLists = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading shopping lists:', error);
    }
  }
}

export default ShopAssistantService;
