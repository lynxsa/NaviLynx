
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

const TestComponent = () => {
  const { t, language } = useLanguage();
  return <Text>{t('welcome')} - {language}</Text>;
};

describe('LanguageContext', () => {
  it('provides default English translations', () => {
    const { getByText } = render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(getByText('welcome - en')).toBeTruthy();
  });
});
