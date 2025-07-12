/**
 * Multilingual Service for NaviLynx
 * Comprehensive support for 9+ South African languages with AI-powered TTS
 * and cultural context awareness
 */

import * as Speech from 'expo-speech';
import { googleAIService } from './googleAIService';

export interface Language {
  code: string;
  name: string;
  localName: string;
  region: string;
  isOfficial: boolean;
  speakers: number; // in millions
  culturalContext: CulturalContext;
}

export interface CulturalContext {
  greetings: string[];
  commonPhrases: string[];
  navigationTerms: string[];
  politenessLevel: 'formal' | 'casual' | 'mixed';
  regionalVariations: string[];
  localCustoms: string[];
}

export interface VoiceSettings {
  language: string;
  voice?: string;
  rate: number;
  pitch: number;
  volume: number;
  quality: 'low' | 'medium' | 'high';
}

export interface TranslationContext {
  domain: 'navigation' | 'shopping' | 'emergency' | 'general';
  formality: 'formal' | 'casual';
  audience: 'adult' | 'child' | 'elderly' | 'mixed';
  region?: string;
}

class MultilingualService {
  private currentLanguage: string = 'en';
  private availableLanguages: Map<string, Language> = new Map();
  private translations: Map<string, Map<string, string>> = new Map();
  private voiceSettings: Map<string, VoiceSettings> = new Map();
  private culturalAdaptations: Map<string, any> = new Map();
  
  // AI-powered translation cache
  private aiTranslationCache: Map<string, string> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.initializeLanguages();
    this.initializeTranslations();
    this.initializeVoiceSettings();
    this.initializeCulturalAdaptations();
  }

  /**
   * Initialize all supported South African languages
   */
  private initializeLanguages(): void {
    const languages: Language[] = [
      {
        code: 'en',
        name: 'English',
        localName: 'English',
        region: 'National',
        isOfficial: true,
        speakers: 4.9,
        culturalContext: {
          greetings: ['Hello', 'Hi', 'Good morning', 'Good afternoon', 'Good evening'],
          commonPhrases: ['Thank you', 'Please', 'Excuse me', 'Sorry', 'Welcome'],
          navigationTerms: ['Go straight', 'Turn left', 'Turn right', 'Stop', 'Continue'],
          politenessLevel: 'mixed',
          regionalVariations: ['South African English', 'British influence'],
          localCustoms: ['Handshake greeting', 'Eye contact important']
        }
      },
      {
        code: 'af',
        name: 'Afrikaans',
        localName: 'Afrikaans',
        region: 'Western Cape, Northern Cape',
        isOfficial: true,
        speakers: 7.0,
        culturalContext: {
          greetings: ['Hallo', 'Goeiemore', 'Goeie middag', 'Goeie naand', 'Howzit'],
          commonPhrases: ['Dankie', 'Asseblief', 'Verskoon my', 'Jammer', 'Welkom'],
          navigationTerms: ['Gaan reguit', 'Draai links', 'Draai regs', 'Stop', 'Gaan voort'],
          politenessLevel: 'mixed',
          regionalVariations: ['Kaapse Afrikaans', 'Boland Afrikaans'],
          localCustoms: ['Firm handshake', 'Direct communication style']
        }
      },
      {
        code: 'zu',
        name: 'Zulu',
        localName: 'isiZulu',
        region: 'KwaZulu-Natal, Gauteng',
        isOfficial: true,
        speakers: 12.0,
        culturalContext: {
          greetings: ['Sawubona', 'Sanibonani', 'Ngiyakwemukela', 'Salani kahle'],
          commonPhrases: ['Ngiyabonga', 'Ngicela', 'Uxolo', 'Ngiyaxolisa', 'Wamukelekile'],
          navigationTerms: ['Hamba uqonde phambili', 'Phendukela kwesokunxele', 'Phendukela kwesokudla', 'Misa', 'Qhubeka'],
          politenessLevel: 'formal',
          regionalVariations: ['Pure Zulu', 'Urban Zulu', 'Rural Zulu'],
          localCustoms: ['Respect for elders', 'Ubuntu philosophy', 'Clan greetings']
        }
      },
      {
        code: 'xh',
        name: 'Xhosa',
        localName: 'isiXhosa',
        region: 'Eastern Cape, Western Cape',
        isOfficial: true,
        speakers: 8.2,
        culturalContext: {
          greetings: ['Molo', 'Molweni', 'Ndiyakwamkela', 'Usale kakuhle'],
          commonPhrases: ['Enkosi', 'Nceda', 'Uxolo', 'Ndicela uxolo', 'Wamkelekile'],
          navigationTerms: ['Hamba uthe tye', 'Jika esekhohlo', 'Jika esekunene', 'Yima', 'Qhubeka'],
          politenessLevel: 'formal',
          regionalVariations: ['Transkei Xhosa', 'Cape Xhosa'],
          localCustoms: ['Click sounds important', 'Respect protocols', 'Traditional naming']
        }
      },
      {
        code: 'st',
        name: 'Sotho',
        localName: 'Sesotho',
        region: 'Free State, Lesotho border',
        isOfficial: true,
        speakers: 3.8,
        culturalContext: {
          greetings: ['Dumela', 'Dumelang', 'Kea u amohela', 'Sala hantle'],
          commonPhrases: ['Kea leboha', 'Ke kopa', 'Tshwarelo', 'Ke kopa tshwarelo', 'O amohelehile'],
          navigationTerms: ['Tsamaya o otlolohile', 'Kgutlela ho le letshehadi', 'Kgutlela ho le letona', 'Ema', 'Tswela pele'],
          politenessLevel: 'formal',
          regionalVariations: ['Southern Sotho', 'Mountain Sotho'],
          localCustoms: ['Respect for chiefs', 'Blanket culture', 'Praise singing']
        }
      },
      {
        code: 'nso',
        name: 'Northern Sotho',
        localName: 'Sepedi',
        region: 'Limpopo, Gauteng',
        isOfficial: true,
        speakers: 4.6,
        culturalContext: {
          greetings: ['Dumela', 'Dumelang', 'Ke a go amogela', 'Sala gabotse'],
          commonPhrases: ['Ke a leboga', 'Ke kgopela', 'Tshwarelo', 'Ke kgopela maitshwarelo', 'O amogetšwe'],
          navigationTerms: ['Sepela ka lebelo', 'Kgutlela ka lehupeng', 'Kgutlela ka lejaneng', 'Ema', 'Tšwela pele'],
          politenessLevel: 'formal',
          regionalVariations: ['Limpopo Sepedi', 'Gauteng Sepedi'],
          localCustoms: ['Age respect', 'Extended family importance', 'Traditional healing']
        }
      },
      {
        code: 'tn',
        name: 'Tswana',
        localName: 'Setswana',
        region: 'North West, Northern Cape',
        isOfficial: true,
        speakers: 4.1,
        culturalContext: {
          greetings: ['Dumela', 'Dumelang', 'Ke a go amogela', 'Tsamaya sentle'],
          commonPhrases: ['Ke a leboga', 'Ke kopa', 'Tshwarelo', 'Ke kopa maitshwarelo', 'O amogetse'],
          navigationTerms: ['Tsamaya o otlolohile', 'Retela ka molemeng', 'Retela ka mojeng', 'Ema', 'Tswelela'],
          politenessLevel: 'mixed',
          regionalVariations: ['Botswana influence', 'South African Tswana'],
          localCustoms: ['Cattle culture', 'Chief respect', 'Praise poetry']
        }
      },
      {
        code: 'ss',
        name: 'Swati',
        localName: 'siSwati',
        region: 'Mpumalanga, eSwatini border',
        isOfficial: true,
        speakers: 1.3,
        culturalContext: {
          greetings: ['Sawubona', 'Sanibonani', 'Ngiyakwemukela', 'Sala kuhle'],
          commonPhrases: ['Ngiyabonga', 'Ngiyacela', 'Ngiyaxolisa', 'Wamukelekile'],
          navigationTerms: ['Hamba uye phambili', 'Jikela ekhohlo', 'Jikela ekunene', 'Yima', 'Chubeka'],
          politenessLevel: 'formal',
          regionalVariations: ['Swazi traditional', 'Modern siSwati'],
          localCustoms: ['Royal respect', 'Age hierarchy', 'Traditional ceremonies']
        }
      },
      {
        code: 've',
        name: 'Venda',
        localName: 'Tshivenda',
        region: 'Limpopo',
        isOfficial: true,
        speakers: 1.2,
        culturalContext: {
          greetings: ['Ndaa', 'Matsheloni', 'Ndi a ni tandulela', 'Salani zwavhudi'],
          commonPhrases: ['Ndo livhuwa', 'Ndi khou humela', 'Vhongolose', 'Ni tshifhiwa'],
          navigationTerms: ['Fambani uri phanda', 'Shandukani khongolose', 'Shandukani tshituna', 'Mikani', 'Takalalani'],
          politenessLevel: 'formal',
          regionalVariations: ['Traditional Venda', 'Urban Venda'],
          localCustoms: ['Sacred sites respect', 'Ancestor veneration', 'Traditional dance']
        }
      },
      {
        code: 'ts',
        name: 'Tsonga',
        localName: 'Xitsonga',
        region: 'Limpopo, Mpumalanga',
        isOfficial: true,
        speakers: 2.3,
        culturalContext: {
          greetings: ['Xewani', 'Xewani loko', 'Ndzi tsakile ku mi vona', 'Mi rhuleni kahle'],
          commonPhrases: ['Inkomu', 'Ndzi kombela', 'Ndzi ri vongolose', 'Mi amukeriwile'],
          navigationTerms: ['Fambani ri nga humeleli', 'Hundzuluka xi matimu', 'Hundzuluka xi ximene', 'Yimani', 'Yani emahlweni'],
          politenessLevel: 'formal',
          regionalVariations: ['Shangaan Tsonga', 'Mozambican influence'],
          localCustoms: ['Music culture', 'Respect for nature', 'Traditional healing']
        }
      },
      {
        code: 'nr',
        name: 'Ndebele',
        localName: 'isiNdebele',
        region: 'Mpumalanga, Limpopo',
        isOfficial: true,
        speakers: 1.1,
        culturalContext: {
          greetings: ['Salibonani', 'Ngiyakwemukela', 'Lisale kuhle'],
          commonPhrases: ['Ngiyabonga', 'Ngiyadinga', 'Ngiyacolisa', 'Lisamukelekile'],
          navigationTerms: ['Hambani liye phambili', 'Jikelelani kwelihle', 'Jikelelani kwelidla', 'Mani', 'Qhubekani'],
          politenessLevel: 'formal',
          regionalVariations: ['Southern Ndebele', 'Northern influence'],
          localCustoms: ['Geometric art', 'Beadwork culture', 'Traditional architecture']
        }
      }
    ];

    languages.forEach(lang => {
      this.availableLanguages.set(lang.code, lang);
    });

    this.isInitialized = true;
    console.log(`Initialized ${languages.length} South African languages`);
  }

  /**
   * Initialize base translations for each language
   */
  private initializeTranslations(): void {
    const baseTranslations = {
      // Navigation
      'welcome': {
        'en': 'Welcome to NaviLynx',
        'af': 'Welkom by NaviLynx',
        'zu': 'Ngiyakwemukela ku-NaviLynx',
        'xh': 'Wamkelekile ku-NaviLynx',
        'st': 'O amohelehile ho NaviLynx',
        'nso': 'O amogetšwe go NaviLynx',
        'tn': 'O amogetse kwa NaviLynx',
        'ss': 'Wamukelekile ku-NaviLynx',
        've': 'Ni tshifhiwa kha NaviLynx',
        'ts': 'Mi amukeriwile eka NaviLynx',
        'nr': 'Lisamukelekile ku-NaviLynx'
      },
      'start_navigation': {
        'en': 'Start Navigation',
        'af': 'Begin Navigasie',
        'zu': 'Qala Ukuzulazula',
        'xh': 'Qalisa Ukuhamba',
        'st': 'Qala ho Tsamaya',
        'nso': 'Thoma go Sepela',
        'tn': 'Simolola go Tsamaya',
        'ss': 'Cala Kuhamba',
        've': 'Thomelani u Famba',
        'ts': 'Sungula ku Famba',
        'nr': 'Qalani Ukuhamba'
      },
      'turn_left': {
        'en': 'Turn left',
        'af': 'Draai links',
        'zu': 'Phendukela kwesokunxele',
        'xh': 'Jika esekhohlo',
        'st': 'Kgutlela ho le letshehadi',
        'nso': 'Kgutlela ka lehupeng',
        'tn': 'Retela ka molemeng',
        'ss': 'Jikela ekhohlo',
        've': 'Shandukani khongolose',
        'ts': 'Hundzuluka xi matimu',
        'nr': 'Jikelelani kwelihle'
      },
      'turn_right': {
        'en': 'Turn right',
        'af': 'Draai regs',
        'zu': 'Phendukela kwesokudla',
        'xh': 'Jika esekunene',
        'st': 'Kgutlela ho le letona',
        'nso': 'Kgutlela ka lejaneng',
        'tn': 'Retela ka mojeng',
        'ss': 'Jikela ekunene',
        've': 'Shandukani tshituna',
        'ts': 'Hundzuluka xi ximene',
        'nr': 'Jikelelani kwelidla'
      },
      'go_straight': {
        'en': 'Go straight',
        'af': 'Gaan reguit',
        'zu': 'Hamba uqonde phambili',
        'xh': 'Hamba uthe tye',
        'st': 'Tsamaya o otlolohile',
        'nso': 'Sepela ka lebelo',
        'tn': 'Tsamaya o otlolohile',
        'ss': 'Hamba uye phambili',
        've': 'Fambani uri phanda',
        'ts': 'Fambani ri nga humeleli',
        'nr': 'Hambani liye phambili'
      },
      'arrived': {
        'en': 'You have arrived',
        'af': 'Jy het aangekom',
        'zu': 'Usufikile',
        'xh': 'Ufike',
        'st': 'O fihlile',
        'nso': 'O fihlile',
        'tn': 'O tsogile',
        'ss': 'Usufikile',
        've': 'No svika',
        'ts': 'Mi fikile',
        'nr': 'Lifikelile'
      },
      // Emergency
      'emergency': {
        'en': 'Emergency',
        'af': 'Noodgeval',
        'zu': 'Isimo esiphuthumayo',
        'xh': 'Ingxaki ekhawulezayo',
        'st': 'Tshohanyetso',
        'nso': 'Tsohanyetšo',
        'tn': 'Tshoganyetso',
        'ss': 'Sigcineni',
        've': 'Zwoitshavha',
        'ts': 'Xiyimo xa xihatla',
        'nr': 'Umsindo'
      },
      'help': {
        'en': 'Help',
        'af': 'Hulp',
        'zu': 'Usizo',
        'xh': 'Uncedo',
        'st': 'Thuso',
        'nso': 'Thušo',
        'tn': 'Thuso',
        'ss': 'Lusito',
        've': 'Thuso',
        'ts': 'Mpfuno',
        'nr': 'Usito'
      },
      // Load Shedding
      'load_shedding': {
        'en': 'Load shedding',
        'af': 'Beurtkrag',
        'zu': 'Ukucishwa kukagesi',
        'xh': 'Ukucinywa kombane',
        'st': 'Ho tima motlakase',
        'nso': 'Go tima mohlagase',
        'tn': 'Go tima motlakase',
        'ss': 'Kucitjwa kugesi',
        've': 'U tima na motlakase',
        'ts': 'Ku tima na gezi',
        'nr': 'Ukucinywa kopheme'
      },
      'backup_power': {
        'en': 'Backup power available',
        'af': 'Rugsteunkrag beskikbaar',
        'zu': 'Ugesi wokunakekela ukhona',
        'xh': 'Umbane wasekontweni ukhona',
        'st': 'Motlakase wa backup o teng',
        'nso': 'Mohlagase wa backup o gona',
        'tn': 'Motlakase wa backup o teng',
        'ss': 'Lugesi lolweketo lukhona',
        've': 'Motlakase wa backup u hone',
        'ts': 'Gezi ra backup ri kona',
        'nr': 'Upheme lwekwezelela lukhona'
      }
    };

    // Store translations
    Object.entries(baseTranslations).forEach(([key, translations]) => {
      this.translations.set(key, new Map(Object.entries(translations)));
    });
  }

  /**
   * Initialize voice settings for each language
   */
  private initializeVoiceSettings(): void {
    this.availableLanguages.forEach((language, code) => {
      this.voiceSettings.set(code, {
        language: code,
        rate: 0.8, // Slightly slower for clarity
        pitch: 1.0,
        volume: 1.0,
        quality: 'high'
      });
    });
  }

  /**
   * Initialize cultural adaptations
   */
  private initializeCulturalAdaptations(): void {
    this.availableLanguages.forEach((language, code) => {
      this.culturalAdaptations.set(code, {
        timeFormat: language.code === 'en' ? '12h' : '24h',
        dateFormat: 'DD/MM/YYYY',
        currencyFormat: 'R{amount}',
        numberFormat: 'decimal',
        addressFormat: 'street_first',
        directionStyle: language.culturalContext.politenessLevel,
        greetingStyle: language.culturalContext.greetings[0]
      });
    });
  }

  /**
   * Get translation for a key in the current language
   */
  translate(key: string, languageCode: string, context?: TranslationContext): string {
    if (!this.isInitialized) {
      return `[${key}]`; // Return key if not initialized
    }

    const targetLang = this.availableLanguages.get(languageCode);
    if (!targetLang) {
      console.warn(`Language code "${languageCode}" not supported. Falling back to English.`);
      return this.translate(key, 'en', context);
    }

    // Check base translations first
    const langTranslations = this.translations.get(languageCode);
    if (langTranslations && langTranslations.has(key)) {
      return langTranslations.get(key)!;
    }

    // Fallback to English if translation not found for the specific language
    const englishTranslations = this.translations.get('en');
    if (englishTranslations && englishTranslations.has(key)) {
      console.warn(`Translation for key "${key}" not found in "${languageCode}". Using English fallback.`);
      return englishTranslations.get(key)!;
    }
    
    // If AI context is provided and key not in base, try AI translation (mocked here)
    if (context) {
        const cacheKey = `${key}_${languageCode}_${JSON.stringify(context)}`;
        if (this.aiTranslationCache.has(cacheKey)) {
            return this.aiTranslationCache.get(cacheKey)!;
        }
        // Simulate AI translation - in real app, call googleAIService.generateCulturalContent or similar
        const aiTranslatedText = `AI(${languageCode}): ${key}`;
        this.aiTranslationCache.set(cacheKey, aiTranslatedText);
        return aiTranslatedText;
    }

    console.warn(`Translation for key "${key}" not found in "${languageCode}" or English fallback.`);
    return `[${key}_${languageCode}]`; // Fallback if key not found anywhere
  }

  /**
   * AI-powered translation for dynamic content
   */
  async translateWithAI(text: string, targetLanguage: string, context?: TranslationContext): Promise<string> {
    const cacheKey = `${text}-${targetLanguage}-${JSON.stringify(context)}`;
    
    // Check cache first
    if (this.aiTranslationCache.has(cacheKey)) {
      return this.aiTranslationCache.get(cacheKey)!;
    }

    try {
      const language = this.availableLanguages.get(targetLanguage);
      if (!language) {
        return text; // Return original if language not supported
      }

      const prompt = this.buildTranslationPrompt(text, language, context);
      const response = await googleAIService.smartSearch({ query: prompt });
      
      const translatedText = this.extractTranslationFromResponse(response.text);
      
      // Cache the result
      this.aiTranslationCache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('AI translation failed:', error);
      return text; // Return original text on error
    }
  }

  /**
   * Generate voice navigation instructions
   */
  async speakInstructions(text: string, language?: string, customSettings?: Partial<VoiceSettings>): Promise<void> {
    const lang = language || this.currentLanguage;
    const settings = this.voiceSettings.get(lang) || this.voiceSettings.get('en')!;
    
    // Merge custom settings
    const finalSettings = { ...settings, ...customSettings };
    
    try {
      // Check if Speech.speak supports the language
      const options = {
        language: this.mapToSpeechLanguage(lang),
        rate: finalSettings.rate,
        pitch: finalSettings.pitch,
        volume: finalSettings.volume
      };

      await Speech.speak(text, options);
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      // Fallback to English
      await Speech.speak(text, { language: 'en' });
    }
  }

  /**
   * Get culturally appropriate navigation instructions
   */
  getCulturalNavigationInstructions(route: any, languageCode: string): string[] {
    const lang = this.availableLanguages.get(languageCode);
    if (!lang) return ['Language not supported'];

    // This is a simplified example. Real implementation would involve complex logic.
    const instructions = route.legs[0].steps.map((step: any) => {
      let instruction = step.html_instructions.replace(/<[^>]*>/g, ''); // Basic strip_tags
      // Apply cultural context (e.g., politeness)
      if (lang.culturalContext.politenessLevel === 'formal') {
        instruction = this.makeFormal(instruction, languageCode);
      }
      return this.translate(instruction, languageCode, { domain: 'navigation', formality: 'formal', audience: 'adult'});
    });
    return instructions;
  }

  /**
   * Switch language and update voice settings
   */
  async switchLanguage(languageCode: string): Promise<boolean> {
    if (!this.availableLanguages.has(languageCode)) {
      console.error(`Language ${languageCode} not supported`);
      return false;
    }

    this.currentLanguage = languageCode;
    
    // Announce language change in the new language
    const welcomeMessage = this.translate('welcome', this.currentLanguage); // Corrected this line
    await this.speakInstructions(welcomeMessage);
    
    console.log(`Language switched to ${languageCode}`);
    return true;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): Language[] {
    return Array.from(this.availableLanguages.values());
  }

  /**
   * Get a greeting in the specified language, considering cultural context
   */
  getGreeting(languageCode: string, context?: { timeOfDay?: string, formality?: 'formal' | 'casual' }): string {
    const lang = this.availableLanguages.get(languageCode);
    if (!lang) return this.getGreeting('en', context); // Fallback to English

    let greetings = lang.culturalContext.greetings;
    // Basic context handling (example)
    if (context?.timeOfDay === 'morning' && lang.code === 'en') {
        greetings = ['Good morning'];
    }

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * Helper to make text formal (example)
   */
  private makeFormal(text: string, languageCode: string): string {
    // Simple example, real implementation would be language-specific
    if (languageCode === 'zu' || languageCode === 'xh') {
      return `Sicela, ${text}`;
    }
    return text;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): Language[] {
    return Array.from(this.availableLanguages.values());
  }

  /**
   * Get available voice options for a language
   */
  async getAvailableVoices(languageCode: string): Promise<Speech.Voice[]> {
    const allVoices = await Speech.getAvailableVoicesAsync();
    return allVoices.filter(voice => voice.language.startsWith(languageCode));
  }

  /**
   * Speak text using Expo Speech with cultural adaptations
   */
  async speak(text: string, languageCode: string, options?: Speech.SpeechOptions): Promise<void> {
    const settings = this.voiceSettings.get(languageCode) || this.voiceSettings.get('en')!;
    let voiceId = settings.voice;

    if (!voiceId) {
        const voices = await this.getAvailableVoices(languageCode);
        if (voices.length > 0) {
            voiceId = voices[0].identifier; // Pick the first available voice
        }
    }

    Speech.speak(text, {
      language: languageCode,
      pitch: settings.pitch,
      rate: settings.rate,
      voice: voiceId,
      ...options,
    });
  }

  // Private helper methods

  private buildTranslationPrompt(text: string, language: Language, context?: TranslationContext): string {
    return `
    Translate the following text to ${language.localName} (${language.name}):
    "${text}"
    
    Context:
    - Domain: ${context?.domain || 'general'}
    - Formality: ${context?.formality || language.culturalContext.politenessLevel}
    - Region: ${language.region}
    - Cultural context: ${language.culturalContext.localCustoms.join(', ')}
    
    Please provide a culturally appropriate translation that respects local customs and language variations.
    `;
  }

  private extractTranslationFromResponse(response: string): string {
    // Extract the actual translation from AI response
    const lines = response.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('Translation:') && !trimmed.startsWith('Context:')) {
        return trimmed;
      }
    }
    return response.split('\n')[0] || response;
  }

  private applyCulturalContext(translation: string, context: TranslationContext): string {
    // Apply cultural modifications based on context
    if (context.formality === 'formal') {
      return this.addRespectfulPrefix(translation);
    } else if (context.formality === 'casual') {
      return this.makeCasualFriendly(translation);
    }
    return translation;
  }

  private addRespectfulPrefix(instruction: string): string {
    const language = this.availableLanguages.get(this.currentLanguage);
    if (!language) return instruction;

    const respectfulPrefixes = {
      'zu': 'Ngicela ',
      'xh': 'Ndiyacela ',
      'st': 'Ke kopa ',
      'nso': 'Ke kgopela ',
      've': 'Ndi khou humela ',
      'ts': 'Ndzi kombela '
    };

    const prefix = respectfulPrefixes[this.currentLanguage as keyof typeof respectfulPrefixes];
    return prefix ? prefix + instruction.toLowerCase() : instruction;
  }

  private makeCasualFriendly(instruction: string): string {
    // Add friendly, casual modifications
    return instruction + ' 😊';
  }

  private formatDistanceForCulture(distance: number): string {
    const language = this.availableLanguages.get(this.currentLanguage);
    if (!language) return ` in ${distance}m`;

    // Different cultures prefer different distance descriptions
    if (distance < 10) {
      return this.translate('very_close', this.currentLanguage) || ' - very close';
    } else if (distance < 50) {
      return this.translate('nearby', this.currentLanguage) || ' - nearby';
    } else {
      return ` - ${distance}m`;
    }
  }

  private mapToSpeechLanguage(languageCode: string): string {
    // Map our language codes to Speech.speak language codes
    const mapping: { [key: string]: string } = {
      'en': 'en-ZA', // South African English
      'af': 'af-ZA', // Afrikaans
      'zu': 'zu-ZA', // Zulu
      'xh': 'xh-ZA', // Xhosa
      'st': 'st-ZA', // Sotho
      'nso': 'nso-ZA', // Northern Sotho
      'tn': 'tn-ZA', // Tswana
      'ss': 'ss-ZA', // Swati
      've': 've-ZA', // Venda
      'ts': 'ts-ZA', // Tsonga
      'nr': 'nr-ZA'  // Ndebele
    };

    return mapping[languageCode] || 'en-ZA';
  }

  /**
   * Get language-specific number formatting
   */
  formatNumber(number: number): string {
    const adaptation = this.culturalAdaptations.get(this.currentLanguage);
    if (!adaptation) return number.toString();

    // Apply cultural number formatting
    return new Intl.NumberFormat('en-ZA').format(number);
  }

  /**
   * Get language-specific currency formatting
   */
  formatCurrency(amount: number): string {
    return `R${this.formatNumber(amount)}`;
  }

  /**
   * Get culturally appropriate greeting
   */
  getCulturalGreeting(timeOfDay?: 'morning' | 'afternoon' | 'evening'): string {
    const language = this.availableLanguages.get(this.currentLanguage);
    if (!language) return 'Hello';

    const greetings = language.culturalContext.greetings;
    
    if (timeOfDay && greetings.length > 1) {
      // Return time-specific greeting if available
      const timeIndex = ['morning', 'afternoon', 'evening'].indexOf(timeOfDay) + 1;
      return greetings[timeIndex] || greetings[0];
    }
    
    return greetings[0];
  }

  /**
   * Check if current language is right-to-left
   */
  isRTL(): boolean {
    // South African languages are all left-to-right
    return false;
  }

  /**
   * Get language-specific voice quality setting
   */
  getVoiceQuality(): VoiceSettings['quality'] {
    const settings = this.voiceSettings.get(this.currentLanguage);
    return settings?.quality || 'medium';
  }

  // Getters
  get current(): string {
    return this.currentLanguage;
  }

  get isReady(): boolean {
    return this.isInitialized;
  }

  get supportedLanguageCount(): number {
    return this.availableLanguages.size;
  }
}

export const multilingualService = new MultilingualService();
