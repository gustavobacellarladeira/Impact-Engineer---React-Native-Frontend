/**
 * CategoryPickerModal Component
 * Modal for selecting a new category for a transaction
 */

import React, { memo, useCallback } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Transaction } from '../../types';
import { spacing, typography, borderRadius, shadows } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { getCategoryIcon } from '../Icons';
import { triggerSelection, triggerLightImpact } from '../../utils/haptics';

// Available categories
const CATEGORIES = [
  'Groceries',
  'Transport',
  'Entertainment',
  'Food & Dining',
  'Shopping',
  'Bills & Utilities',
  'Health',
  'Travel',
  'Subscription',
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
];

interface CategoryPickerModalProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (transactionId: string, category: string) => void;
}

function CategoryPickerModalComponent({
  transaction,
  visible,
  onClose,
  onSelectCategory,
}: CategoryPickerModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose]);

  const handleSelectCategory = useCallback(
    (category: string) => {
      if (!transaction) return;
      triggerSelection();
      onSelectCategory(transaction.id, category);
      onClose();
    },
    [transaction, onSelectCategory, onClose],
  );

  if (!transaction) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingBottom: insets.bottom },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.borderLight,
            },
          ]}
        >
          <View
            style={[styles.handleBar, { backgroundColor: colors.border }]}
          />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Change Category
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select a new category for {transaction.merchant}
          </Text>
          <Pressable
            style={styles.closeButton}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={[styles.closeText, { color: colors.primary }]}>
              Cancel
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map(category => {
              const isSelected = transaction.category === category;
              const IconComponent = getCategoryIcon(category);

              return (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    isSelected && {
                      borderColor: colors.primary,
                      backgroundColor: colors.primary + '10',
                    },
                  ]}
                  onPress={() => handleSelectCategory(category)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${category}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: colors.primaryLight + '30' },
                      isSelected && { backgroundColor: colors.primary },
                    ]}
                  >
                    <IconComponent
                      size={24}
                      color={isSelected ? colors.surface : colors.primary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      { color: colors.textPrimary },
                      isSelected && {
                        color: colors.primary,
                        fontWeight: typography.weight.semibold,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {category}
                  </Text>
                  {isSelected && (
                    <Text style={[styles.checkmark, { color: colors.primary }]}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export const CategoryPickerModal = memo(CategoryPickerModalComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  handleBar: {
    width: 36,
    height: 5,
    borderRadius: 3,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.sm,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.xl,
  },
  closeText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
  },
  content: {
    padding: spacing.lg,
  },
  categoriesGrid: {
    gap: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...shadows.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryText: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  checkmark: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
});
