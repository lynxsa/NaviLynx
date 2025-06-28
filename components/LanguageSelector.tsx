
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import GlassCard from './GlassCard';

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageCode: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

interface LanguageSelectorProps {
  onLanguageChange: (newLanguage: 'en' | 'zu' | 'af' | 'xh' | 'ts' | 'nso' | 'tn' | 've') => void;
}

const LanguageCodeMap = {
  en: 'English',
  zu: 'isiZulu',
  af: 'Afrikaans',
  xh: 'isiXhosa',
  ts: 'Xitsonga',
  nso: 'Sepedi',
  tn: 'Setswana',
  ve: 'Tshivenda'
} as const;

export default function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const { colors } = useTheme();
  const { currentLanguage: language, setLanguage, t, supportedLanguages } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsVisible(false);
  };

const currentLanguageName = supportedLanguages[language as keyof typeof supportedLanguages];

  return (
    <>
      <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.selector}>
        <Text style={[styles.languageText, { color: colors.text }]}>{currentLanguageName}</Text>
        <IconSymbol name="chevron.down" size={16} color={colors.text} />
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageList}>
              {Object.entries(supportedLanguages).map(([code, name]) => (
                <TouchableOpacity
                  key={code}
                  style={[styles.languageOption, { borderBottomColor: colors.border }]}
                  onPress={() => handleLanguageSelect(code as Language)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={[styles.languageName, { color: colors.text }]}>{name}</Text>
                    <Text style={[styles.languageCode, { color: colors.secondary }]}>
                      <Text style={[styles.languageCode, { color: colors.secondary }]}>
                        {LanguageCodeMap[code as keyof typeof LanguageCodeMap]}
                      </Text>
                    </Text>
                    <Text style={[styles.languageCode, { color: colors.secondary }]}>
                      {LanguageCodeMap[code as keyof typeof LanguageCodeMap]}
                    </Text>
                  </View>
                  {language === code && <IconSymbol name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </>
  );
}
