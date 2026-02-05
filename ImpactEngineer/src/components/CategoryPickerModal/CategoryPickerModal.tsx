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
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '../../theme';
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
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.handleBar} />
          <Text style={styles.title}>Change Category</Text>
          <Text style={styles.subtitle}>
            Select a new category for {transaction.merchant}
          </Text>
          <Pressable
            style={styles.closeButton}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.closeText}>Cancel</Text>
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
                    isSelected && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleSelectCategory(category)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${category}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      isSelected && styles.categoryIconSelected,
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
                      isSelected && styles.categoryTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {category}
                  </Text>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  handleBar: {
    width: 36,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
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
    color: colors.primary,
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
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  categoryItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryIconSelected: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
  },
  categoryTextSelected: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  checkmark: {
    fontSize: typography.size.lg,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
});
