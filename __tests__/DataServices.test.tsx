import { getAllEnhancedVenues, EnhancedVenue } from '@/data/enhancedVenues';

describe('Data Services', () => {
  describe('Enhanced Venues', () => {
    let enhancedVenues: EnhancedVenue[];

    beforeAll(() => {
      enhancedVenues = getAllEnhancedVenues();
    });

    it('should have valid venue data structure', () => {
      expect(enhancedVenues).toBeDefined();
      expect(Array.isArray(enhancedVenues)).toBe(true);
      expect(enhancedVenues.length).toBeGreaterThan(0);
    });

    it('should have required properties for each venue', () => {
      enhancedVenues.forEach((venue: EnhancedVenue) => {
        expect(venue).toHaveProperty('id');
        expect(venue).toHaveProperty('name');
        expect(venue).toHaveProperty('type');
        expect(venue).toHaveProperty('location');
        expect(venue).toHaveProperty('description');
        expect(venue).toHaveProperty('rating');
        
        // Validate location structure
        expect(venue.location).toHaveProperty('coordinates');
        expect(venue.location.coordinates).toHaveProperty('latitude');
        expect(venue.location.coordinates).toHaveProperty('longitude');
        expect(typeof venue.location.coordinates.latitude).toBe('number');
        expect(typeof venue.location.coordinates.longitude).toBe('number');
        
        // Validate rating is a number between 0 and 5
        expect(typeof venue.rating).toBe('number');
        expect(venue.rating).toBeGreaterThanOrEqual(0);
        expect(venue.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have South African venues', () => {
      const southAfricanVenues = enhancedVenues.filter((venue: EnhancedVenue) => 
        venue.name.includes('Sandton') || 
        venue.name.includes('Cape Town') || 
        venue.name.includes('Johannesburg') ||
        venue.name.includes('Durban') ||
        venue.location.address.includes('South Africa') ||
        venue.location.province.includes('Gauteng') ||
        venue.location.province.includes('Western Cape')
      );
      
      expect(southAfricanVenues.length).toBeGreaterThan(0);
    });

    it('should have venues with valid coordinates for South Africa', () => {
      // South Africa latitude: approximately -22° to -35°
      // South Africa longitude: approximately 16° to 33°
      const southAfricanVenues = enhancedVenues.filter((venue: EnhancedVenue) => 
        venue.location.coordinates.latitude >= -35 && venue.location.coordinates.latitude <= -22 &&
        venue.location.coordinates.longitude >= 16 && venue.location.coordinates.longitude <= 33
      );
      
      expect(southAfricanVenues.length).toBeGreaterThan(0);
    });

    it('should have venues with proper features and amenities', () => {
      enhancedVenues.forEach((venue: EnhancedVenue) => {
        expect(venue).toHaveProperty('features');
        expect(venue).toHaveProperty('amenities');
        expect(Array.isArray(venue.features)).toBe(true);
        expect(Array.isArray(venue.amenities)).toBe(true);
      });
    });

    it('should have venues with opening hours', () => {
      enhancedVenues.forEach((venue: EnhancedVenue) => {
        expect(venue).toHaveProperty('openingHours');
        expect(typeof venue.openingHours).toBe('object');
        expect(venue.openingHours).toHaveProperty('monday');
        expect(venue.openingHours).toHaveProperty('sunday');
      });
    });
  });
});
