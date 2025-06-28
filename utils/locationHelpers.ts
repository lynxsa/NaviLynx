
import * as Location from 'expo-location';

export interface SALocation {
  name: string;
  city: string;
  province: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  postalCode?: string;
  category: string;
}

// Major South African cities and provinces
export const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Free State',
];

export const SA_MAJOR_CITIES = [
  { name: 'Johannesburg', province: 'Gauteng', coordinates: { latitude: -26.2041, longitude: 28.0473 } },
  { name: 'Cape Town', province: 'Western Cape', coordinates: { latitude: -33.9249, longitude: 18.4241 } },
  { name: 'Durban', province: 'KwaZulu-Natal', coordinates: { latitude: -29.8587, longitude: 31.0218 } },
  { name: 'Pretoria', province: 'Gauteng', coordinates: { latitude: -25.7479, longitude: 28.2293 } },
  { name: 'Port Elizabeth', province: 'Eastern Cape', coordinates: { latitude: -33.9608, longitude: 25.6022 } },
  { name: 'Bloemfontein', province: 'Free State', coordinates: { latitude: -29.0852, longitude: 26.1596 } },
];

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Format distance for South African context
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
}

// Format South African phone numbers
export function formatSAPhoneNumber(number: string): string {
  // Remove all non-numeric characters
  const cleaned = number.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('27')) {
    // International format
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.startsWith('0')) {
    // Local format
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  } else {
    return number; // Return original if format is unclear
  }
}

// Validate South African postal code
export function isValidSAPostalCode(postalCode: string): boolean {
  // SA postal codes are 4 digits
  return /^\d{4}$/.test(postalCode);
}

// Get current weather info (mock for now)
export function getCurrentWeather(latitude: number, longitude: number): Promise<string> {
  return new Promise((resolve) => {
    // Mock weather data for South African cities
    const weatherOptions = [
      'Sunny, 22°C',
      'Partly Cloudy, 19°C',
      'Clear Sky, 25°C',
      'Light Rain, 16°C',
      'Warm & Humid, 28°C',
    ];
    
    setTimeout(() => {
      const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      resolve(randomWeather);
    }, 1000);
  });
}

// Get emergency numbers for South Africa
export function getEmergencyNumbers() {
  return {
    police: '10111',
    ambulance: '10177',
    fire: '10111',
    emergencyServices: '112',
    poisonInformation: '0861 555 777',
    childLine: '116',
    genderBasedViolence: '0800 428 428',
  };
}

// Check if location is within South Africa bounds
export function isInSouthAfrica(latitude: number, longitude: number): boolean {
  // Rough bounds for South Africa
  const bounds = {
    north: -22.0,
    south: -35.0,
    west: 16.0,
    east: 33.0,
  };
  
  return (
    latitude >= bounds.south &&
    latitude <= bounds.north &&
    longitude >= bounds.west &&
    longitude <= bounds.east
  );
}

// Get nearest major city
export function getNearestMajorCity(latitude: number, longitude: number): typeof SA_MAJOR_CITIES[0] | null {
  let nearest = null;
  let minDistance = Infinity;
  
  for (const city of SA_MAJOR_CITIES) {
    const distance = calculateDistance(
      latitude,
      longitude,
      city.coordinates.latitude,
      city.coordinates.longitude
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }
  
  return nearest;
}
