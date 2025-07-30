import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseCard } from '../components/cards/index';
import { colors } from '../styles/modernTheme';

// Demo data to showcase card reusability
const demoVenue = {
  id: '1',
  name: 'Gateway Theatre of Shopping',
  location: { city: 'Durban', province: 'KwaZulu-Natal' },
  shortDescription: 'Premier shopping destination with over 400 stores',
  rating: 4.5,
  reviewCount: 1234,
  headerImage: 'https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Gateway+Theatre',
  isFeatured: true,
};

const demoDeal = {
  id: '2',
  title: '50% Off Electronics',
  description: 'Massive sale on all electronics items including phones, laptops, and accessories',
  price: 299,
  originalPrice: 599,
  store: { name: 'TechStore', rating: 4.2 },
  discountPercentage: 50,
};

const demoArticle = {
  id: '3',
  title: 'Best Shopping Tips for 2024',
  excerpt: 'Discover the latest shopping trends and money-saving tips that will help you shop smarter',
  author: 'Jane Smith',
  publishDate: new Date('2024-01-15'),
  readTime: 5,
  category: 'Shopping',
};

export default function CardDemoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Reusable Card System</Text>
          <Text style={styles.subtitle}>One BaseCard, Multiple Use Cases</Text>
        </View>

        {/* Base Card Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Base Card Variants</Text>
          
          <BaseCard style={styles.exampleCard} variant="default">
            <Text style={styles.cardTitle}>Default Card</Text>
            <Text style={styles.cardText}>Standard card with subtle shadow</Text>
          </BaseCard>

          <BaseCard style={styles.exampleCard} variant="elevated">
            <Text style={styles.cardTitle}>Elevated Card</Text>
            <Text style={styles.cardText}>Enhanced shadow for prominence</Text>
          </BaseCard>

          <BaseCard style={styles.exampleCard} variant="flat">
            <Text style={styles.cardTitle}>Flat Card</Text>
            <Text style={styles.cardText}>No shadow, clean minimal look</Text>
          </BaseCard>

          <BaseCard style={styles.exampleCard} variant="outlined">
            <Text style={styles.cardTitle}>Outlined Card</Text>
            <Text style={styles.cardText}>Border instead of shadow</Text>
          </BaseCard>
        </View>

        {/* Card Sizes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Card Sizes</Text>
          
          <BaseCard style={styles.exampleCard} size="small" variant="elevated">
            <Text style={styles.cardTitle}>Small Card</Text>
            <Text style={styles.cardText}>Compact padding</Text>
          </BaseCard>

          <BaseCard style={styles.exampleCard} size="medium" variant="elevated">
            <Text style={styles.cardTitle}>Medium Card</Text>
            <Text style={styles.cardText}>Standard padding (default)</Text>
          </BaseCard>

          <BaseCard style={styles.exampleCard} size="large" variant="elevated">
            <Text style={styles.cardTitle}>Large Card</Text>
            <Text style={styles.cardText}>Generous padding for important content</Text>
          </BaseCard>
        </View>

        {/* Interactive Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Interactive Cards</Text>
          
          <BaseCard 
            style={styles.exampleCard} 
            variant="elevated"
            onPress={() => console.log('Venue card pressed!')}
          >
            <Text style={styles.cardTitle}>Venue Card (Interactive)</Text>
            <Text style={styles.cardText}>Based on: {demoVenue.name}</Text>
            <Text style={styles.cardSubtext}>Tap to navigate</Text>
          </BaseCard>

          <BaseCard 
            style={styles.exampleCard} 
            variant="elevated"
            onPress={() => console.log('Deal card pressed!')}
          >
            <Text style={styles.cardTitle}>Deal Card (Interactive)</Text>
            <Text style={styles.cardText}>{demoDeal.title}</Text>
            <Text style={styles.priceText}>R{demoDeal.price} (was R{demoDeal.originalPrice})</Text>
          </BaseCard>

          <BaseCard 
            style={styles.exampleCard} 
            variant="elevated"
            onPress={() => console.log('Article card pressed!')}
          >
            <Text style={styles.cardTitle}>Article Card (Interactive)</Text>
            <Text style={styles.cardText}>{demoArticle.title}</Text>
            <Text style={styles.cardSubtext}>By {demoArticle.author} • {demoArticle.readTime} min read</Text>
          </BaseCard>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Benefits Achieved</Text>
          
          <BaseCard style={styles.benefitCard} variant="flat">
            <Text style={styles.benefitTitle}>🔄 Reusability</Text>
            <Text style={styles.benefitText}>
              One BaseCard component used for all card types instead of creating separate cards each time
            </Text>
          </BaseCard>

          <BaseCard style={styles.benefitCard} variant="flat">
            <Text style={styles.benefitTitle}>🎨 Consistency</Text>
            <Text style={styles.benefitText}>
              Unified design system with consistent shadows, borders, and interactions
            </Text>
          </BaseCard>

          <BaseCard style={styles.benefitCard} variant="flat">
            <Text style={styles.benefitTitle}>⚡ Efficiency</Text>
            <Text style={styles.benefitText}>
              Faster development - just import BaseCard and focus on content, not styling
            </Text>
          </BaseCard>

          <BaseCard style={styles.benefitCard} variant="flat">
            <Text style={styles.benefitTitle}>🛠️ Maintainability</Text>
            <Text style={styles.benefitText}>
              Single source of truth for card styling across entire application
            </Text>
          </BaseCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  exampleCard: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  cardSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  benefitCard: {
    backgroundColor: colors.secondary + '15',
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
