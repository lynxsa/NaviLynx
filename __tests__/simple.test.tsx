import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

describe('Simple Test', () => {
  it('should render a basic component', () => {
    const TestComponent = () => (
      <View>
        <Text>Test Component</Text>
      </View>
    );

    const { getByText } = render(<TestComponent />);
    expect(getByText('Test Component')).toBeTruthy();
  });

  it('should perform basic math', () => {
    expect(2 + 2).toBe(4);
  });
});
