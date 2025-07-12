import React from 'react';
import { render } from '@testing-library/react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

describe('IconSymbol Component', () => {
  it('renders correctly with valid icon name', () => {
    const { UNSAFE_getByType } = render(
      <IconSymbol name="house" size={24} color="#000000" />
    );
    
    expect(UNSAFE_getByType(IconSymbol)).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { UNSAFE_getByType } = render(
      <IconSymbol name="house.fill" size={32} color="#FF0000" />
    );
    
    const icon = UNSAFE_getByType(IconSymbol);
    expect(icon).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { UNSAFE_getByType } = render(
      <IconSymbol name="star" size={24} color="#FFD700" />
    );
    
    const icon = UNSAFE_getByType(IconSymbol);
    expect(icon).toBeTruthy();
  });

  it('handles different icon names', () => {
    const iconNames = ['house', 'star', 'person', 'gear', 'map'] as const;
    
    iconNames.forEach((iconName) => {
      const { UNSAFE_getByType } = render(
        <IconSymbol name={iconName} size={24} color="#000000" />
      );
      
      expect(UNSAFE_getByType(IconSymbol)).toBeTruthy();
    });
  });

  it('renders with default props', () => {
    const { UNSAFE_getByType } = render(
      <IconSymbol name="house" color={''} />
    );
    
    expect(UNSAFE_getByType(IconSymbol)).toBeTruthy();
  });
});
