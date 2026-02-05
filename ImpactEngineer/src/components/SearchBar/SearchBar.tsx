/**
 * SearchBar Component
 * Search input for filtering transactions by merchant name
 */

import React, { memo } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography, shadows } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

function SearchBarComponent({
  value,
  onChangeText,
  placeholder = 'Search transactions...',
}: SearchBarProps) {
  const { colors } = useTheme();
  const showClearButton = value.length > 0;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {/* Search Icon */}
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textHint}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search transactions"
          accessibilityHint="Enter merchant name to filter transactions"
        />

        {showClearButton && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={styles.clearButton}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Text style={[styles.clearIcon, { color: colors.textSecondary }]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export const SearchBar = memo(SearchBarComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: typography.size.md,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: typography.size.md,
  },
  clearButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  clearIcon: {
    fontSize: typography.size.md,
  },
});
