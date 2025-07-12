import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search venues, events, deals..." 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useTheme();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery.trim());
    } else if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    if (onSearch) {
      onSearch(text.trim());
    }
  };

  const searchContainerStyle = [
    styles.searchContainer,
    {
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(139,92,246,0.1)',
      borderColor: isFocused ? colors.primary[500] : colors.primary[300],
      borderWidth: 2,
    }
  ];

  return (
    <View>
      {/* Main Search Container */}
      <View style={searchContainerStyle}>
        <IconSymbol 
          name="magnifyingglass" 
          size={20} 
          color={isFocused ? colors.primary[600] : colors.primary[400]} 
        />
        <TextInput
          style={[
            styles.searchInput,
            { color: isDark ? '#FFFFFF' : colors.gray[900] }
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          value={searchQuery}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setSearchQuery('');
              if (onSearch) onSearch('');
            }}
            style={styles.clearButton}
          >
            <IconSymbol name="xmark.circle.fill" size={18} color={colors.gray[400]} />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          onPress={handleSearch}
          style={styles.searchButton}
        >
          <IconSymbol name="arrow.right" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Quick Filter Pills */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[
          styles.filterPill,
          { backgroundColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)' }
        ]}>
          <Text style={[styles.filterText, { color: colors.primary[600] }]}>🛍️ Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[
          styles.filterPill,
          { backgroundColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)' }
        ]}>
          <Text style={[styles.filterText, { color: colors.primary[600] }]}>🍽️ Dining</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[
          styles.filterPill,
          { backgroundColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)' }
        ]}>
          <Text style={[styles.filterText, { color: colors.primary[600] }]}>🎬 Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[
          styles.filterPill,
          { backgroundColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)' }
        ]}>
          <Text style={[styles.filterText, { color: colors.primary[600] }]}>🏥 Medical</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: spacing.md,
    fontSize: 16,
  },
  clearButton: {
    padding: spacing.xs,
  },
  searchButton: {
    marginLeft: spacing.sm,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  filterPill: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterText: {
    fontWeight: '500',
    fontSize: 14,
  },
});

export default SearchBar;
