import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import ExploreScreen from '@/app/(tabs)/explore';

// Mock dependencies
jest.mock('@/data/enhancedVenues', () => ({
  venueCategories: [
    {
      id: 'shopping-malls',
      name: 'Shopping Malls',
      description: 'Premier shopping destinations',
      icon: 'shopping-bag',
      image: 'https://example.com/category.jpg',
      color: '#FF6B6B',
      venueCount: 2,
      popularTags: ['fashion', 'dining']
    },
    {
      id: 'airports',
      name: 'Airports',
      description: 'Major airports',
      icon: 'airplane',
      image: 'https://example.com/airport.jpg',
      color: '#4ECDC4',
      venueCount: 1,
      popularTags: ['travel', 'duty-free']
    }
  ],
  getAllEnhancedVenues: jest.fn(() => [
    {
      id: '1',
      name: 'Sandton City',
      type: 'mall',
      location: { 
        coordinates: { latitude: -26.1076, longitude: 28.0567 },
        address: '83 Rivonia Rd, Sandhurst, Sandton, 2196',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2196'
      },
      rating: 4.8,
      description: 'Premier shopping destination in Africa',
      shortDescription: 'Top shopping mall',
      headerImage: 'https://example.com/sandton-city.jpg',
      images: ['https://example.com/sandton-city.jpg'],
      contact: {
        phone: '+27 11 217 6000',
        website: 'https://sandtoncity.co.za'
      },
      openingHours: {
        monday: '09:00 - 21:00',
        tuesday: '09:00 - 21:00',
        wednesday: '09:00 - 21:00',
        thursday: '09:00 - 21:00',
        friday: '09:00 - 21:00',
        saturday: '09:00 - 21:00',
        sunday: '09:00 - 19:00'
      },
      amenities: ['Parking', 'Restaurants', 'ATM'],
      features: ['Indoor Navigation', 'AR Shopping', 'Digital Concierge'],
      zones: [],
      promotions: [],
      events: [],
      tags: ['shopping', 'mall'],
      isFeatured: true,
      status: 'active' as const
    }
  ]),
  getVenuesByCategory: jest.fn(() => []),
  searchVenues: jest.fn(() => [])
}));

const MockedExploreScreen = () => (
  <ThemeProvider>
    <LanguageProvider>
      <ExploreScreen />
    </LanguageProvider>
  </ThemeProvider>
);

describe('ExploreScreen', () => {
  it('renders explore screen correctly', () => {
    const { getByPlaceholderText } = render(<MockedExploreScreen />);
    
    expect(getByPlaceholderText('Search venues, stores, or services...')).toBeTruthy();
  });

  it('displays search functionality', () => {
    const { getByPlaceholderText } = render(<MockedExploreScreen />);
    
    const searchInput = getByPlaceholderText('Search venues, stores, or services...');
    expect(searchInput).toBeTruthy();
  });

  it('handles search functionality', async () => {
    const { getByPlaceholderText } = render(<MockedExploreScreen />);
    
    const searchInput = getByPlaceholderText('Search venues, stores, or services...');
    fireEvent.changeText(searchInput, 'Sandton');
    
    await waitFor(() => {
      expect(searchInput.props.value).toBe('Sandton');
    });
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<MockedExploreScreen />);
    expect(toJSON()).toBeTruthy();
  });
});
