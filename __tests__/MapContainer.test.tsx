import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import MapContainer from '../components/explorer/MapView/MapContainer';
import * as Location from 'expo-location';
import { getVenuesWithCache } from '../utils/venueCache';

jest.mock('expo-location');
jest.mock('../utils/venueCache');

describe('MapContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator initially', () => {
    const { UNSAFE_getByType } = render(<MapContainer />);
    // Look for ActivityIndicator component instead of testID
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('shows error if location permission denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    (getVenuesWithCache as jest.Mock).mockResolvedValue([]);
    const { findByText } = render(<MapContainer />);
    // Wait for the error to appear
    const errorElement = await findByText(/Location permission denied/i);
    expect(errorElement).toBeTruthy();
  });

  it('shows error if venue loading fails', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({ coords: { latitude: 0, longitude: 0 } });
    (getVenuesWithCache as jest.Mock).mockRejectedValue(new Error('fail'));
    const { findByText } = render(<MapContainer />);
    // Wait for the error to appear
    const errorElement = await findByText(/Could not load venues/i);
    expect(errorElement).toBeTruthy();
  });
});
