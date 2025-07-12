export const SUPPORTED_LANGUAGES = {
  en: 'English',
  zu: 'isiZulu',
  af: 'Afrikaans',
  xh: 'isiXhosa',
  ts: 'Xitsonga',
  nso: 'Sepedi',
  tn: 'Setswana',
  ve: 'Tshivenḓa',
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

export const TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    arNav: 'AR Nav',
    parking: 'Parking',
    profile: 'Profile',
    explore: 'Explore',
    
    // Common actions
    search: 'Search venues...',
    navigate: 'Navigate',
    save: 'Save',
    cancel: 'Cancel',
    retry: 'Retry',
    close: 'Close',
    next: 'Next',
    back: 'Back',
    finish: 'Finish',
    getStarted: 'Get Started',
    
    // Categories
    hospitals: 'Hospitals',
    malls: 'Malls',
    airports: 'Airports',
    schools: 'Schools',
    parks: 'Parks',
    events: 'Events',
    
    // Smart Tiles
    nearby: 'Nearby',
    favorites: 'Favorites',
    newStores: 'New Stores',
    
    // Venue details
    hours: 'Hours',
    phone: 'Phone',
    emergency: 'Emergency',
    directions: 'Directions',
    joinChat: 'Join Chat',
    
    // AR Navigation
    arNavigationTitle: 'AR Navigation',
    startNavigation: 'Start Navigation',
    stopNavigation: 'Stop Navigation',
    currentFloor: 'Current Floor',
    navigating: 'Navigating to',
    arrived: 'You have arrived!',
    
    // Onboarding
    welcomeToNaviLynx: 'Welcome to NaviLynx',
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    phoneNumber: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    homeLocation: 'Home Location',
    interests: 'Shopping Interests',
    createAccount: 'Create Account',
    
    // Parking
    parkingTitle: 'Parking Assistant',
    saveLocation: 'Save Parking Location',
    findCar: 'Find My Car',
    addNote: 'Add Note',
    extendTime: 'Extend Time',
    
    // Enhanced UI translations
    exploreVenues: 'Explore Venues',
    discoverNewPlaces: 'Discover amazing places around you',
    searchVenues: 'Search venues...',
    clearFilters: 'Clear Filters',
    all: 'All',
    venue: 'venue',
    venues: 'venues',
    found: 'found',
    noVenuesFound: 'No venues found',
    tryDifferentSearch: 'Try a different search or clear filters',
    
    // Weather
    currentWeather: 'Current Weather',
    
    // Parking Enhanced
    smartParking: 'Smart Parking',
    findParkingEasily: 'Find and manage parking spots easily',
    available: 'Available',
    saved: 'Saved',
    reserve: 'Reserve',
    unavailable: 'Unavailable',
    deleteSpot: 'Delete Spot',
    delete: 'Delete',
    saveSpotHint: 'Use the camera button to save your current parking spot',
    saveFirstSpot: 'Save First Spot',
    noSavedSpots: 'No saved parking spots',
    arNavigation: 'AR Navigation',
    startAR: 'Start AR',
    arNavigationPrompt: 'Use AR to navigate to your parking spot',
    success: 'Success',
    
    // Weather and other components
    findYourWay: 'Find your way to amazing places',
    quickAccess: 'Quick Access',
    trendingVenues: 'Trending Venues',
    seeAll: 'See All',
    justForYou: 'Just for You',
    quickActions: 'Quick Actions',
    arNavigate: 'AR Navigate',
    findParking: 'Find Parking',
    exploreVenues2: 'Explore Venues',
    
    // Profile enhancements
    myProfile: 'My Profile',
    personalStats: 'Personal Stats',
    venuesVisited: 'Venues Visited',
    timesSaved: 'Times Saved',
    pointsEarned: 'Points Earned',
    editProfile: 'Edit Profile',
    accountSettings: 'Account Settings',
    preferences: 'Preferences',
    helpSupport: 'Help & Support',
    aboutApp: 'About App',
    
    // Additional common terms
    loading: 'Loading...',
    refresh: 'Refresh',
    more: 'More',
    less: 'Less',
    
    // Errors
    networkError: 'Network connection failed. Please check your internet connection.',
    locationPermissionDenied: 'Location permission is required for navigation.',
    cameraPermissionDenied: 'Camera permission is required for AR navigation.',
    arInitializationFailed: 'Failed to initialize AR. Please try again.',
    parkingReservationFailed: 'Unable to reserve parking spot. Please try again.',
    venueNotFound: 'Venue information not found.',
    navigationFailed: 'Navigation failed to start. Please try again.',
    
    // Weather
    weather: 'Weather',
    temperature: 'Temperature',
    
    // Emergency
    emergencyHelp: 'Emergency Help',
    findNearestHelp: 'Find Nearest Help',
    
    // Settings
    settings: 'Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    notifications: 'Notifications',
    locationServices: 'Location Services',
    
    // Additional parking terms
    manageParkingSubtitle: 'Manage your parking with ease',
    spots: 'spots',
    walk: 'walk',
    extend: 'Extend',
    reserveSpot: 'Reserve Spot',
    myParking: 'My Parking',
    realtimeAvailability: 'Real-time parking availability in your area',
    availableSpots: 'Available Parking Spots',
    parkedVehiclesAppearHere: 'Your parked vehicles will appear here',
    optional: 'optional',
    notePlaceholder: 'e.g., Near entrance, Level P2, Section A',
    saving: 'Saving...',
    clearParking: 'Clear Parking Info',
    clearParkingInfoPrompt: 'Are you sure you want to clear saved parking information?',
    clear: 'Clear',
    extendTimePrompt: 'How much time would you like to add?',
    navigateToVehicleSandtonCity: 'Navigate to your vehicle at Sandton City?',
    navigateToVehicleCanalWalk: 'Navigate to your vehicle at Canal Walk?',
    navigateToVehicleORTambo: 'Navigate to your vehicle at OR Tambo Airport?',
    navigationStarted: 'Navigation Started',
    navigatingToSpot: 'Navigating to your parking spot...',
    reserveParkingSpot: 'Reserve Parking Spot',
    reserveSpotPrompt: 'Reserve this parking spot',
    spotReserved: 'Spot Reserved',
    spotReservedConfirmation: 'Your parking spot has been reserved at',
  },
  
  zu: {
    // Navigation
    home: 'Ikhaya',
    arNav: 'I-AR Nav',
    parking: 'Ukupaka',
    profile: 'Iphrofayili',
    explore: 'Hlola',
    
    // Common actions
    search: 'Sesha izindawo...',
    navigate: 'Zulazula',
    save: 'Londoloza',
    cancel: 'Khansela',
    retry: 'Zama futhi',
    close: 'Vala',
    next: 'Okulandelayo',
    back: 'Emuva',
    finish: 'Qeda',
    getStarted: 'Qala',
    
    // Categories
    hospitals: 'Izibhedlela',
    malls: 'Amakhemikhali',
    airports: 'Izikhumulo zezindiza',
    schools: 'Izikole',
    parks: 'Amapaki',
    events: 'Imehlelo',
    
    // Smart Tiles
    nearby: 'Eduze',
    favorites: 'Ozithandayo',
    newStores: 'Izitolo Ezintsha',
    
    // Venue details
    hours: 'Amahora',
    phone: 'Ifoni',
    emergency: 'Isimo siphuthelayo',
    directions: 'Izikhomba',
    joinChat: 'Joyina Ingxoxo',
    
    // Enhanced UI translations
    exploreVenues: 'Hlola Izindawo',
    discoverNewPlaces: 'Thola izindawo ezimangalisayo ezizungeze wena',
    searchVenues: 'Sesha izindawo...',
    clearFilters: 'Sula Izihlungi',
    all: 'Konke',
    venue: 'indawo',
    venues: 'izindawo',
    found: 'kutholakele',
    noVenuesFound: 'Azikho izindawo ezitholakalayo',
    tryDifferentSearch: 'Zama ukusesha okwehlukile noma sula izihlungi',
    
    // Parking Enhanced
    smartParking: 'Ukupaka Okuhlakaniphile',
    findParkingEasily: 'Thola futhi ulawule izindawo zokupaka kalula',
    available: 'Kuyatholakala',
    saved: 'Kulondoloziwe',
    reserve: 'Beka bucala',
    unavailable: 'Akutholakali',
    deleteSpot: 'Susa Indawo',
    delete: 'Susa',
    saveSpotHint: 'Sebenzisa inkinobho yekhamera ukuze ulondoloze indawo yakho yokupaka yamanje',
    saveFirstSpot: 'Londoloza Indawo Yokuqala',
    noSavedSpots: 'Azikho izindawo zokupaka ezilondoloziwe',
    arNavigation: 'Ukuzulazula nge-AR',
    startAR: 'Qala i-AR',
    arNavigationPrompt: 'Sebenzisa i-AR ukuze uzulazulele endaweni yakho yokupaka',
    success: 'Impumelelo',
    
    // Additional common terms
    loading: 'Kulayisha...',
    refresh: 'Vuselela',
    more: 'Okuningi',
    less: 'Okuncane',
    
    // Settings
    settings: 'Izilungiselelo',
    darkMode: 'Imodi Emnyama',
    language: 'Ulimi',
    notifications: 'Izaziso',
    locationServices: 'Amasevisi Wendawo',
    
    // Parking terms
    manageParkingSubtitle: 'Lawula ukupaka kwakho kalula',
    spots: 'izindawo',
    walk: 'hamba',
    extend: 'Nweba',
    reserveSpot: 'Beka Indawo Bucala',
    myParking: 'Ukupaka Kwami',
    realtimeAvailability: 'Ukutholakala kokupaka kwesikhathi sangempela endaweni yakho',
    availableSpots: 'Izindawo Zokupaka Ezitholakalayo',
    parkedVehiclesAppearHere: 'Izimoto zakho ezipakiwe zizovela lapha',
    optional: 'ongakukhetha',
    notePlaceholder: 'isib. Eduze komnyango wokungena, Level P2, Section A',
    saving: 'Kulondoloza...',
    clearParking: 'Sula Ulwazi Lokupaka',
    clearParkingInfoPrompt: 'Uqinisekile ukuthi ufuna ukusula ulwazi lokupaka olulondoloziwe?',
    clear: 'Sula',
    extendTimePrompt: 'Yisiphi isikhathi osifuna ukusengeza?',
    navigateToVehicleSandtonCity: 'Zulazulela emoteni yakho e-Sandton City?',
    navigateToVehicleCanalWalk: 'Zulazulela emoteni yakho e-Canal Walk?',
    navigateToVehicleORTambo: 'Zulazulela emoteni yakho e-OR Tambo Airport?',
    navigationStarted: 'Ukuzulazula Kuqaliwe',
    navigatingToSpot: 'Kuzulazulela endaweni yakho yokupaka...',
    reserveParkingSpot: 'Beka Indawo Yokupaka Bucala',
    reserveSpotPrompt: 'Beka le ndawo yokupaka bucala',
    spotReserved: 'Indawo Ibekelwe Bucala',
    spotReservedConfirmation: 'Indawo yakho yokupaka ibekelwe bucala e',
  },
  
  af: {
    // Navigation
    home: 'Tuis',
    arNav: 'AR Nav',
    parking: 'Parkering',
    profile: 'Profiel',
    explore: 'Verken',
    
    // Common actions
    search: 'Soek plekke...',
    navigate: 'Navigeer',
    save: 'Stoor',
    cancel: 'Kanselleer',
    retry: 'Probeer weer',
    close: 'Sluit',
    next: 'Volgende',
    back: 'Terug',
    finish: 'Klaar',
    getStarted: 'Begin',
    
    // Categories
    hospitals: 'Hospitale',
    malls: 'Winkelsentrums',
    airports: 'Lughawens',
    schools: 'Skole',
    parks: 'Parke',
    events: 'Geleenthede',
    
    // Enhanced UI translations
    exploreVenues: 'Verken Plekke',
    discoverNewPlaces: 'Ontdek wonderlike plekke rondom jou',
    searchVenues: 'Soek plekke...',
    clearFilters: 'Maak Filters Skoon',
    all: 'Alles',
    venue: 'plek',
    venues: 'plekke',
    found: 'gevind',
    noVenuesFound: 'Geen plekke gevind nie',
    tryDifferentSearch: 'Probeer \'n ander soektog of maak filters skoon',
    
    // Parking Enhanced
    smartParking: 'Slim Parkering',
    findParkingEasily: 'Vind en bestuur parkeerplek maklik',
    available: 'Beskikbaar',
    saved: 'Gestoor',
    reserve: 'Reserveer',
    unavailable: 'Nie beskikbaar nie',
    deleteSpot: 'Verwyder Plek',
    delete: 'Verwyder',
    saveSpotHint: 'Gebruik die kamera knoppie om jou huidige parkeerplek te stoor',
    saveFirstSpot: 'Stoor Eerste Plek',
    noSavedSpots: 'Geen gestoorde parkeerplekke nie',
    arNavigation: 'AR Navigasie',
    startAR: 'Begin AR',
    arNavigationPrompt: 'Gebruik AR om na jou parkeerplek te navigeer',
    success: 'Sukses',
    
    // Additional common terms
    loading: 'Laai...',
    refresh: 'Verfris',
    more: 'Meer',
    less: 'Minder',
    
    // Settings
    settings: 'Instellings',
    darkMode: 'Donker Modus',
    language: 'Taal',
    notifications: 'Kennisgewings',
    locationServices: 'Liggingsdienste',
    
    // Parking terms
    manageParkingSubtitle: 'Bestuur jou parkering met gemak',
    spots: 'plekke',
    walk: 'loop',
    extend: 'Verleng',
    reserveSpot: 'Reserveer Plek',
    myParking: 'My Parkering',
    realtimeAvailability: 'Werklike-tyd parkering beskikbaarheid in jou area',
    availableSpots: 'Beskikbare Parkeerplekke',
    parkedVehiclesAppearHere: 'Jou geparkeerde voertuie sal hier verskyn',
    optional: 'opsioneel',
    notePlaceholder: 'bv. Naby ingang, Vlak P2, Afdeling A',
    saving: 'Stoor...',
    clearParking: 'Maak Parkering Info Skoon',
    clearParkingInfoPrompt: 'Is jy seker jy wil gestoorde parkering inligting verwyder?',
    clear: 'Maak skoon',
    extendTimePrompt: 'Hoeveel tyd wil jy byvoeg?',
    navigateToVehicleSandtonCity: 'Navigeer na jou voertuig by Sandton City?',
    navigateToVehicleCanalWalk: 'Navigeer na jou voertuig by Canal Walk?',
    navigateToVehicleORTambo: 'Navigeer na jou voertuig by OR Tambo Lughawe?',
    navigationStarted: 'Navigasie Begin',
    navigatingToSpot: 'Navigeer na jou parkeerplek...',
    reserveParkingSpot: 'Reserveer Parkeerplek',
    reserveSpotPrompt: 'Reserveer hierdie parkeerplek',
    spotReserved: 'Plek Gereserveer',
    spotReservedConfirmation: 'Jou parkeerplek is gereserveer by',
  },
  
  xh: {
    // Navigation
    home: 'Ekhaya',
    arNav: 'I-AR Nav',
    parking: 'Ukupaka',
    profile: 'Iprofayile',
    explore: 'Phonononga',
    
    // Common actions
    search: 'Khangela iindawo...',
    navigate: 'Khokela',
    save: 'Gcina',
    cancel: 'Rhoxisa',
    retry: 'Zama kwakhona',
    close: 'Vala',
    next: 'Okulandelayo',
    back: 'Emva',
    finish: 'Gqiba',
    getStarted: 'Qala',
    
    // Categories
    hospitals: 'Izibhedlele',
    malls: 'Iivenkile ezinkulu',
    airports: 'Izikhululo zeenqwelomoya',
    schools: 'Izikolo',
    parks: 'Iipaki',
    events: 'Imisitho',
    
    // Enhanced UI translations
    exploreVenues: 'Phonononga Iindawo',
    discoverNewPlaces: 'Fumanisa iindawo ezimangalisayo ezikufuphi nawe',
    searchVenues: 'Khangela iindawo...',
    clearFilters: 'Susa Izihluzi',
    all: 'Konke',
    venue: 'indawo',
    venues: 'iindawo',
    found: 'ifunyenwe',
    noVenuesFound: 'Akukho ndawo ifunyenweyo',
    tryDifferentSearch: 'Zama ukukhangela okwahlukileyo okanye ususe izihluzi',
    
    // Parking Enhanced
    smartParking: 'Ukupaka Okubukhalifkhali',
    findParkingEasily: 'Fumana kwaye ulawule iindawo zokupaka ngokulula',
    available: 'Kuyafumaneka',
    saved: 'Kugcinwe',
    reserve: 'Beka bucala',
    unavailable: 'Akufumaneki',
    deleteSpot: 'Cima Indawo',
    delete: 'Cima',
    saveSpotHint: 'Sebenzisa iqhosha lekhamera ukugcina indawo yakho yokupaka yangoku',
    saveFirstSpot: 'Gcina Indawo Yokuqala',
    noSavedSpots: 'Akukho ndawo zokupaka zigciniweyo',
    arNavigation: 'Ukukhokela nge-AR',
    startAR: 'Qala i-AR',
    arNavigationPrompt: 'Sebenzisa i-AR ukukhokela kwindawo yakho yokupaka',
    success: 'Impumelelo',
    
    // Additional common terms
    loading: 'Kulayisha...',
    refresh: 'Hlaziya',
    more: 'Okungaphezulu',
    less: 'Okuncinci',
    
    // Settings
    settings: 'Iisetingi',
    darkMode: 'Imowudi Emnyama',
    language: 'Ulwimi',
    notifications: 'Izaziso',
    locationServices: 'Iinkonzo Zendawo',
    
    // Parking terms
    manageParkingSubtitle: 'Lawula ukupaka kwakho ngokulula',
    spots: 'iindawo',
    walk: 'hamba',
    extend: 'Yandisa',
    reserveSpot: 'Beka Indawo Bucala',
    myParking: 'Ukupaka Kwam',
    realtimeAvailability: 'Ukufumaneka kokupaka kwexesha lokwenyani kwindawo yakho',
    availableSpots: 'Iindawo Zokupaka Ezifumanekayo',
    parkedVehiclesAppearHere: 'Izithuthi zakho ezipakishiweyo ziya kuvela apha',
    optional: 'okungatyalwayo',
    notePlaceholder: 'umz. Kufuphi nomnyango, Level P2, Icandelo A',
    saving: 'Kugcinwa...',
    clearParking: 'Susa Ulwazi Lokupaka',
    clearParkingInfoPrompt: 'Uqinisekile ukuba ufuna ukususa ulwazi lokupaka olugciniweyo?',
    clear: 'Susa',
    extendTimePrompt: 'Loluphi ixesha olifuna ukongeza?',
    navigateToVehicleSandtonCity: 'Khokela kwisithuthi sakho eSandton City?',
    navigateToVehicleCanalWalk: 'Khokela kwisithuthi sakho eCanal Walk?',
    navigateToVehicleORTambo: 'Khokela kwisithuthi sakho eOR Tambo Airport?',
    navigationStarted: 'Ukukhokela Kuqalile',
    navigatingToSpot: 'Kukhokela kwindawo yakho yokupaka...',
    reserveParkingSpot: 'Beka Indawo Yokupaka Bucala',
    reserveSpotPrompt: 'Beka le ndawo yokupaka bucala',
    spotReserved: 'Indawo Ibekelwe Bucala',
    spotReservedConfirmation: 'Indawo yakho yokupaka ibekelwe bucala e',
  },
  
  ts: {
    // Navigation
    home: 'Kaya',
    arNav: 'AR Nav',
    parking: 'Ku paka',
    profile: 'Profayili',
    explore: 'Kambela',
    
    // Common actions
    search: 'Lava switirhelo...',
    navigate: 'Kongomisa',
    save: 'Hlayisa',
    cancel: 'Tshika',
    all: 'Hinkwaswo',
    available: 'Swi kumeka',
    saved: 'Swi hlayisiwile',
    loading: 'Yi layisha...',
    
    // Categories
    hospitals: 'Tihospitali',
    malls: 'Timali',
    airports: 'Swikombhele swa mafikimoya',
    schools: 'Swikolo',
    parks: 'Maphaka',
    events: 'Swiendlakalo',
    
    // Smart Tiles
    nearby: 'Khwi',
    favorites: 'Leswi hamamekaka',
    newStores: 'Maxava manzha',
    
    // Basic UI
    exploreVenues: 'Kambela Switirhelo',
    smartParking: 'Ku paka hi vutlhari',
    settings: 'Swivumbiwa',
  },
  
  nso: {
    // Navigation
    home: 'Gae',
    arNav: 'AR Nav',
    parking: 'Temogo',
    profile: 'Profaele',
    explore: 'Nyakisisa',
    
    // Common actions
    search: 'Nyaka mafelo...',
    navigate: 'Supishetsa',
    save: 'Boloka',
    cancel: 'Fedishetsa',
    all: 'Kamoka',
    available: 'Go na le',
    saved: 'Go bolokilwe',
    loading: 'Go laetsa...',
    
    // Categories
    hospitals: 'Dikokologo',
    malls: 'Direkisetso',
    airports: 'Dirapeng',
    schools: 'Dikolo',
    parks: 'Dipaka',
    events: 'Ditiragalo',
    
    // Smart Tiles
    nearby: 'Goja',
    favorites: 'Tse di ratehang',
    newStores: 'Marekisetso a maswa',
    
    // Basic UI
    exploreVenues: 'Nyakisisa Mafelo',
    smartParking: 'Temogo ya Bohlale',
    settings: 'Dipeakanyo',
  },
  
  tn: {
    // Navigation
    home: 'Gae',
    arNav: 'AR Nav',
    parking: 'Temogo',
    profile: 'Profaele',
    explore: 'Batla',
    
    // Common actions
    search: 'Batla mafelo...',
    navigate: 'Kaela',
    save: 'Boloka',
    cancel: 'Tila',
    all: 'Tsotlhe',
    available: 'Go na le',
    saved: 'Go bolokilwe',
    loading: 'Go tsenya...',
    
    // Categories
    hospitals: 'Dikokologo',
    malls: 'Direkisa',
    airports: 'Dibaka tsa difofane',
    schools: 'Dikolo',
    parks: 'Dipaka',
    events: 'Ditiragalo',
    
    // Smart Tiles
    nearby: 'Gaufi',
    favorites: 'Tse di ratehang',
    newStores: 'Marekisa a maswa',
    
    // Basic UI
    exploreVenues: 'Batla Mafelo',
    smartParking: 'Temogo ya Botlhale',
    settings: 'Dipeakanyo',
  },
  
  ve: {
    // Navigation
    home: 'Hayani',
    arNav: 'AR Nav',
    parking: 'U imisa',
    profile: 'Phurofailo',
    explore: 'Toda',
    
    // Common actions
    search: 'Toda mafunzi...',
    navigate: 'Sumbedza',
    save: 'Dzhenisa',
    cancel: 'Khantsha',
    all: 'Zwothe',
    available: 'Zwo wanala',
    saved: 'Zwo dzheniswaho',
    loading: 'Zwo khou longoletshiwa...',
    
    // Categories
    hospitals: 'Zwikokologo',
    malls: 'Mabadela',
    airports: 'Zwikologo zwa ndege',
    schools: 'Zwikolo',
    parks: 'Maphaka',
    events: 'Zwiitiswa',
    
    // Smart Tiles
    nearby: 'Fhami',
    favorites: 'Zwinzhi',
    newStores: 'Mabadela maswa',
    
    // Basic UI
    exploreVenues: 'Toda Mafunzi',
    smartParking: 'U imisa ha vhuhlamuhi',
    settings: 'Maimo',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

export const getTranslation = (key: TranslationKey, language: LanguageCode = 'en'): string => {
  const translations = TRANSLATIONS[language] || TRANSLATIONS.en;
  return (translations as any)[key] || TRANSLATIONS.en[key] || key;
};
