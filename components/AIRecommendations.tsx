
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import GlassCard from './GlassCard';
import { IconSymbol } from './ui/IconSymbol';
import { Spacing } from '@/constants/Theme';

const { width } = Dimensions.get('window');

interface AIRecommendation {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  rating: number;
  distance: string;
  estimatedTime: string;
  aiReason: string;
  relevanceScore: number;
  address: string;
  features: string[];
  promotions?: string[];
}

interface AIRecommendationsProps {
  userProfile?: any;
  currentLocation?: any;
  limit?: number;
}

export function AIRecommendations({ userProfile, currentLocation, limit = 5 }: AIRecommendationsProps) {
  const { colors } = useTheme();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const calculateRelevanceScore = React.useCallback((recommendation: AIRecommendation, profile: any): number => {
    let score = recommendation.relevanceScore;

    if (!profile) return score;

    // Adjust score based on user interests
    if (profile.interests) {
      if (profile.interests.includes('Shopping') && recommendation.type.includes('Shopping')) {
        score += 10;
      }
      if (profile.interests.includes('Entertainment') && recommendation.type.includes('Entertainment')) {
        score += 10;
      }
      if (profile.interests.includes('Healthcare') && recommendation.type.includes('Hospital')) {
        score += 15;
      }
    }

    return score;
  }, []);

  const generateAIRecommendations = React.useCallback(() => {
    // Simulated AI recommendation engine based on user profile
    const baseRecommendations: AIRecommendation[] = [
      {
        id: '1',
        name: 'Sandton City Shopping Centre',
        type: 'Shopping Mall',
        description: 'Premium shopping destination with luxury brands and dining options',
        image: 'https://picsum.photos/400/250?random=1',
        rating: 4.5,
        distance: '2.3 km',
        estimatedTime: '8 min drive',
        aiReason: 'Based on your shopping interests and premium preferences',
        relevanceScore: 95,
        address: 'Sandton, Johannesburg, Gauteng',
        features: ['Luxury Shopping', 'Fine Dining', 'Parking Available', 'AR Navigation'],
        promotions: ['20% off at selected stores', 'Free parking for 3 hours']
      },
      {
        id: '2',
        name: 'V&A Waterfront',
        type: 'Entertainment Complex',
        description: 'Iconic waterfront destination with shopping, dining, and entertainment',
        image: 'https://picsum.photos/400/250?random=2',
        rating: 4.7,
        distance: '1.8 km',
        estimatedTime: '6 min drive',
        aiReason: 'Perfect match for entertainment and dining preferences',
        relevanceScore: 92,
        address: 'Victoria & Alfred Waterfront, Cape Town',
        features: ['Ocean Views', 'Live Entertainment', 'Fine Dining', 'Tourist Friendly'],
        promotions: ['Happy hour at waterfront restaurants', '10% off aquarium tickets']
      },
      {
        id: '3',
        name: 'OR Tambo International Airport',
        type: 'Airport',
        description: 'Major international airport with extensive shopping and dining',
        image: 'https://picsum.photos/400/250?random=3',
        rating: 4.2,
        distance: '15.6 km',
        estimatedTime: '25 min drive',
        aiReason: 'Recommended for business travelers and frequent flyers',
        relevanceScore: 88,
        address: 'Kempton Park, Johannesburg, Gauteng',
        features: ['Duty-Free Shopping', 'Business Lounges', '24/7 Services', 'International Cuisine'],
        promotions: ['Airport lounge day pass discount']
      },
      {
        id: '4',
        name: 'Gateway Theatre of Shopping',
        type: 'Shopping Mall',
        description: 'One of the largest shopping centers in the Southern Hemisphere',
        image: 'https://picsum.photos/400/250?random=4',
        rating: 4.4,
        distance: '5.2 km',
        estimatedTime: '12 min drive',
        aiReason: 'Great for families and extensive shopping needs',
        relevanceScore: 85,
        address: 'Umhlanga, Durban, KwaZulu-Natal',
        features: ['Wave House', 'Cinema Complex', 'Family Entertainment', 'Diverse Dining'],
        promotions: ['Family day specials', 'Movie and meal combos']
      },
      {
        id: '5',
        name: 'Menlyn Park Shopping Centre',
        type: 'Shopping Mall',
        description: 'Modern shopping center with fashion, electronics, and entertainment',
        image: 'https://picsum.photos/400/250?random=5',
        rating: 4.3,
        distance: '7.1 km',
        estimatedTime: '15 min drive',
        aiReason: 'Matches your technology and fashion interests',
        relevanceScore: 82,
        address: 'Menlyn, Pretoria, Gauteng',
        features: ['Tech Stores', 'Fashion Outlets', 'Food Court', 'Gaming Zone'],
        promotions: ['Tech week discounts', 'Student specials']
      },
      {
        id: '6',
        name: 'Groote Schuur Hospital',
        type: 'Hospital',
        description: 'Leading academic hospital with specialized medical services',
        image: 'https://picsum.photos/400/250?random=6',
        rating: 4.1,
        distance: '3.4 km',
        estimatedTime: '10 min drive',
        aiReason: 'Healthcare facility recommendation based on your profile',
        relevanceScore: 75,
        address: 'Observatory, Cape Town, Western Cape',
        features: ['Specialized Care', 'Emergency Services', 'Research Facility', 'Patient Parking'],
      },
      {
        id: '7',
        name: 'Kirstenbosch National Botanical Garden',
        type: 'Park',
        description: 'World-renowned botanical garden showcasing South African flora',
        image: 'https://picsum.photos/400/250?random=7',
        rating: 4.8,
        distance: '8.9 km',
        estimatedTime: '18 min drive',
        aiReason: 'Perfect for nature lovers and outdoor enthusiasts',
        relevanceScore: 90,
        address: 'Newlands, Cape Town, Western Cape',
        features: ['Botanical Gardens', 'Hiking Trails', 'Concert Venue', 'Educational Tours'],
        promotions: ['Summer concert series tickets']
      },
      {
        id: '8',
        name: 'University of Cape Town',
        type: 'Educational',
        description: 'Prestigious university with beautiful campus and academic facilities',
        image: 'https://picsum.photos/400/250?random=8',
        rating: 4.6,
        distance: '4.7 km',
        estimatedTime: '12 min drive',
        aiReason: 'Recommended for students and academic visitors',
        relevanceScore: 80,
        address: 'Rondebosch, Cape Town, Western Cape',
        features: ['Historic Campus', 'Libraries', 'Museums', 'Student Services'],
      }
    ];

    // AI scoring algorithm based on user profile
    return baseRecommendations
      .map(rec => ({
        ...rec,
        relevanceScore: calculateRelevanceScore(rec, userProfile)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [userProfile, calculateRelevanceScore]);

  const generateRecommendations = React.useCallback(async () => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const aiRecommendations = generateAIRecommendations();
      setRecommendations(aiRecommendations.slice(0, limit));
      setIsLoading(false);
    }, 1500);
  }, [limit, generateAIRecommendations]);
  
    useEffect(() => {
      generateRecommendations();
    }, [userProfile, currentLocation, generateRecommendations]);

  const renderRecommendation = (recommendation: AIRecommendation) => (
    <TouchableOpacity key={recommendation.id} style={styles.recommendationCard}>
      <GlassCard style={styles.cardContent}>
        <Image source={{ uri: recommendation.image }} style={styles.venueImage} />
        
        <View style={styles.aiIndicator}>
          <LinearGradient
            colors={[colors.primary || '#000000', colors.secondary || '#666666']}
            style={styles.aiGradient}
          >
            <IconSymbol name="brain.head.profile" size={12} color="#FFFFFF" />
            <Text style={styles.aiText}>AI</Text>
          </LinearGradient>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={[styles.venueName, { color: colors.text }]}>{recommendation.name}</Text>
              <Text style={[styles.venueType, { color: colors.icon }]}>{recommendation.type}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, { color: colors.primary }]}>
                {recommendation.relevanceScore}%
              </Text>
              <Text style={[styles.scoreLabel, { color: colors.icon }]}>match</Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.text + '80' }]}>
            {recommendation.description}
          </Text>

          <View style={styles.aiReasonContainer}>
            <IconSymbol name="lightbulb.fill" size={14} color={colors.primary} />
            <Text style={[styles.aiReason, { color: colors.primary }]}>
              {recommendation.aiReason}
            </Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <IconSymbol name="star.fill" size={14} color="#FFD700" />
              <Text style={[styles.metricText, { color: colors.text }]}>{recommendation.rating}</Text>
            </View>
            <View style={styles.metric}>
              <IconSymbol name="location" size={14} color={colors.icon} />
              <Text style={[styles.metricText, { color: colors.text }]}>{recommendation.distance}</Text>
            </View>
            <View style={styles.metric}>
              <IconSymbol name="clock" size={14} color={colors.icon} />
              <Text style={[styles.metricText, { color: colors.text }]}>{recommendation.estimatedTime}</Text>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            {recommendation.features.slice(0, 3).map((feature, index) => (
              <View key={index} style={[styles.featureTag, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.featureText, { color: colors.primary }]}>{feature}</Text>
              </View>
            ))}
          </View>

          {recommendation.promotions && recommendation.promotions.length > 0 && (
            <View style={styles.promotionsContainer}>
              <IconSymbol name="gift.fill" size={16} color={colors.secondary ?? '#666666'} />
              <Text style={[styles.promotionText, { color: colors.secondary }]}>
                {recommendation.promotions[0]}
              </Text>
            </View>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[colors.primary ?? '#000000', colors.secondary ?? '#666666']}
          style={styles.loadingGradient}
        >
          <IconSymbol name="brain.head.profile" size={24} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          AI is analyzing your preferences...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[colors.primary ?? '#000000', colors.secondary ?? '#666666']}
          style={styles.headerGradient}
        >
          <IconSymbol name="brain.head.profile" size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          AI Recommendations for You
        </Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recommendations.map(renderRecommendation)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  headerGradient: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  recommendationCard: {
    width: width * 0.85,
    marginRight: Spacing.md,
  },
  cardContent: {
    overflow: 'hidden',
  },
  venueImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  aiIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  aiGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  venueType: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  aiReasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  aiReason: {
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  featureTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '500',
  },
  promotionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  promotionText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
});
