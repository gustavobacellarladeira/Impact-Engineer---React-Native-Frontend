/**
 * CreateTransactionModal Component
 * Modal for creating a new transaction
 */

import React, { memo, useCallback, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Transaction } from '../../types';
import { spacing, typography, borderRadius, shadows } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { getCategoryIcon } from '../Icons';
import {
  triggerSelection,
  triggerLightImpact,
  triggerSuccess,
} from '../../utils/haptics';

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

interface CreateTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

function CreateTransactionModalComponent({
  visible,
  onClose,
  onCreateTransaction,
}: CreateTransactionModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Form state
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setMerchant('');
    setAmount('');
    setType('expense');
    setCategory('Other');
  }, []);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleSubmit = useCallback(async () => {
    if (!merchant.trim() || !amount.trim()) return;

    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    setIsSubmitting(true);
    triggerSuccess();

    const newTransaction: Omit<Transaction, 'id'> = {
      merchant: merchant.trim(),
      amount: type === 'expense' ? -numericAmount : numericAmount,
      type,
      category,
      date: new Date().toISOString(),
    };

    await onCreateTransaction(newTransaction);
    resetForm();
    onClose();
    setIsSubmitting(false);
  }, [
    merchant,
    amount,
    type,
    category,
    onCreateTransaction,
    onClose,
    resetForm,
  ]);

  const handleTypeChange = useCallback((newType: 'income' | 'expense') => {
    triggerSelection();
    setType(newType);
  }, []);

  const handleCategorySelect = useCallback((cat: string) => {
    triggerSelection();
    setCategory(cat);
  }, []);

  const isFormValid = merchant.trim().length > 0 && amount.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom,
            },
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
              New Transaction
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
            keyboardShouldPersistTaps="handled"
          >
            {/* Type Selector */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                Type
              </Text>
              <View style={styles.typeContainer}>
                <Pressable
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        type === 'expense' ? colors.expense : colors.surface,
                      borderColor:
                        type === 'expense' ? colors.expense : colors.border,
                    },
                  ]}
                  onPress={() => handleTypeChange('expense')}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color:
                          type === 'expense' ? '#FFFFFF' : colors.textPrimary,
                      },
                    ]}
                  >
                    Expense
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        type === 'income' ? colors.income : colors.surface,
                      borderColor:
                        type === 'income' ? colors.income : colors.border,
                    },
                  ]}
                  onPress={() => handleTypeChange('income')}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color:
                          type === 'income' ? '#FFFFFF' : colors.textPrimary,
                      },
                    ]}
                  >
                    Income
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Merchant Input */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                Merchant / Description
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                value={merchant}
                onChangeText={setMerchant}
                placeholder="e.g., Coffee Shop, Salary"
                placeholderTextColor={colors.textHint}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Amount Input */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                Amount
              </Text>
              <View
                style={[
                  styles.amountInputContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.currencySymbol,
                    {
                      color: type === 'income' ? colors.income : colors.expense,
                    },
                  ]}
                >
                  {type === 'income' ? '+' : '-'} $
                </Text>
                <TextInput
                  style={[styles.amountInput, { color: colors.textPrimary }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textHint}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                Category
              </Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat;
                  const IconComponent = getCategoryIcon(cat);

                  return (
                    <Pressable
                      key={cat}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : colors.surface,
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                      onPress={() => handleCategorySelect(cat)}
                    >
                      <IconComponent
                        size={16}
                        color={isSelected ? '#FFFFFF' : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textPrimary,
                          },
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View
            style={[
              styles.footer,
              {
                backgroundColor: colors.surface,
                paddingBottom: insets.bottom + spacing.lg,
              },
            ]}
          >
            <Pressable
              style={[
                styles.submitButton,
                {
                  backgroundColor: isFormValid ? colors.primary : colors.border,
                },
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Create transaction"
            >
              <Text
                style={[
                  styles.submitButtonText,
                  { color: isFormValid ? '#FFFFFF' : colors.textHint },
                ]}
              >
                {isSubmitting ? 'Creating...' : 'Create Transaction'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export const CreateTransactionModal = memo(CreateTransactionModalComponent);

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
    paddingBottom: 160,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  typeText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
  },
  currencySymbol: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    paddingVertical: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: spacing.xs,
  },
  categoryChipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    ...shadows.md,
  },
  submitButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
});
