import React from 'react';
import { ScrollView, View } from 'react-native';
import { venues } from '../../../data/venues';
import VenueCard from '../../VenueCardEnhanced';
import { useSavedVenues } from '../../../context/SavedVenuesContext';

const demoTags = [
  ['WiFi', 'Family Friendly', 'Wheelchair Accessible'],
  ['Parking', 'Pet Friendly'],
  ['Live Music', 'Sea View'],
];

const demoStatuses = ['open', 'busy', 'closed'];

export default function VenueCardDemo() {
  const { isSaved, toggleVenue } = useSavedVenues();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 16 }}>
      {venues.map((venue, idx) => (
        <View key={venue.id} style={{ marginRight: 16 }}>
          <VenueCard
            id={venue.id}
            name={venue.name}
            category={venue.type}
            distance={Math.round(Math.random() * 5 + 1) + ' km'}
            badge={venue.featured ? 'Featured' : undefined}
            imageUrl={undefined} // No imageUrl in data, so pass undefined
            description={venue.description}
            rating={4.2 + idx * 0.2}
            isOpen={demoStatuses[idx % 3] !== 'closed'}
            status={demoStatuses[idx % 3] as any}
            tags={demoTags[idx % demoTags.length]}
            initiallySaved={isSaved(venue.id)}
            onSaveToggle={() => toggleVenue(venue.id)}
            onPress={() => {}}
            onChatPress={() => {}}
          />
        </View>
      ))}
    </ScrollView>
  );
}
