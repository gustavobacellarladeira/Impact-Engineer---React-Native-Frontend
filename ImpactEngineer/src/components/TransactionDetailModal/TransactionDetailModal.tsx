/**
 * TransactionDetailModal Component
 * Modal displaying full transaction details with edit/delete functionality
 */

import React, { memo, useCallback, useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Transaction } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { getCategoryIcon } from '../Icons';
import {
  triggerLightImpact,
  triggerSuccess,
  triggerWarning,
} from '../../utils/haptics';

// Edit Icon
const EditIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Delete Icon
const DeleteIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Category Icon
const CategoryIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={7} cy={7} r={1.5} fill={color} />
  </Svg>
);

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

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
  onDelete?: (transaction: Transaction) => void;
  onUpdateCategory?: (transactionId: string, category: string) => void;
  onUpdateTransaction?: (
    transactionId: string,
    updates: Partial<Transaction>,
  ) => void;
}

function TransactionDetailModalComponent({
  transaction,
  visible,
  onClose,
  onDelete,
  onUpdateCategory,
  onUpdateTransaction,
}: TransactionDetailModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Edit form state
  const [editMerchant, setEditMerchant] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState<'income' | 'expense'>('expense');

  // Reset form when transaction changes
  useEffect(() => {
    if (transaction) {
      setEditMerchant(transaction.merchant);
      setEditAmount(Math.abs(transaction.amount).toString());
      setEditCategory(transaction.category);
      setEditType(transaction.type);
    }
    setIsEditMode(false);
    setShowCategoryPicker(false);
  }, [transaction]);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    setIsEditMode(false);
    setShowCategoryPicker(false);
    onClose();
  }, [onClose]);

  const handleEdit = useCallback(() => {
    triggerLightImpact();
    setIsEditMode(true);
    setShowCategoryPicker(false);
  }, []);

  const handleCancelEdit = useCallback(() => {
    triggerLightImpact();
    if (transaction) {
      setEditMerchant(transaction.merchant);
      setEditAmount(Math.abs(transaction.amount).toString());
      setEditCategory(transaction.category);
      setEditType(transaction.type);
    }
    setIsEditMode(false);
  }, [transaction]);

  const handleSaveEdit = useCallback(() => {
    if (!transaction || !onUpdateTransaction) return;

    const numericAmount = parseFloat(editAmount.replace(/[^0-9.]/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    triggerSuccess();
    onUpdateTransaction(transaction.id, {
      merchant: editMerchant.trim(),
      amount: editType === 'expense' ? -numericAmount : numericAmount,
      category: editCategory,
      type: editType,
    });
    setIsEditMode(false);
  }, [
    transaction,
    editMerchant,
    editAmount,
    editCategory,
    editType,
    onUpdateTransaction,
  ]);

  const handleDelete = useCallback(() => {
    if (!transaction || !onDelete) return;

    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete this transaction?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            triggerWarning();
            onDelete(transaction);
            onClose();
          },
        },
      ],
    );
  }, [transaction, onDelete, onClose]);

  const handleShowCategoryPicker = useCallback(() => {
    triggerLightImpact();
    setShowCategoryPicker(true);
  }, []);

  const handleSelectCategory = useCallback(
    (category: string) => {
      triggerLightImpact();
      if (isEditMode) {
        setEditCategory(category);
      } else if (transaction && onUpdateCategory) {
        onUpdateCategory(transaction.id, category);
      }
      setShowCategoryPicker(false);
    },
    [isEditMode, transaction, onUpdateCategory],
  );

  if (!transaction) return null;

  const isIncome = isEditMode
    ? editType === 'income'
    : transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const amountPrefix = isIncome ? '+' : '-';
  const displayCategory = isEditMode ? editCategory : transaction.category;
  const IconComponent = getCategoryIcon(displayCategory);

  const transactionDate = new Date(transaction.date);
  const formattedDate = transactionDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = transactionDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const isFormValid =
    editMerchant.trim().length > 0 && editAmount.trim().length > 0;

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
          {isEditMode ? (
            <>
              <Pressable
                style={styles.headerLeftButton}
                onPress={handleCancelEdit}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text
                  style={[
                    styles.headerButtonText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                Edit Transaction
              </Text>
              <Pressable
                style={styles.closeButton}
                onPress={handleSaveEdit}
                disabled={!isFormValid}
                accessibilityRole="button"
                accessibilityLabel="Save"
              >
                <Text
                  style={[
                    styles.closeText,
                    { color: isFormValid ? colors.primary : colors.textHint },
                  ]}
                >
                  Save
                </Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.closeButton}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text style={[styles.closeText, { color: colors.primary }]}>
                Done
              </Text>
            </Pressable>
          )}
        </View>

        {/* Category Picker Overlay */}
        {showCategoryPicker ? (
          <ScrollView
            style={styles.categoryPickerContainer}
            contentContainerStyle={styles.categoryPickerContent}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textSecondary, marginBottom: spacing.md },
              ]}
            >
              Select Category
            </Text>
            {CATEGORIES.map(cat => {
              const CatIcon = getCategoryIcon(cat);
              const isSelected = cat === displayCategory;
              return (
                <Pressable
                  key={cat}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor: isSelected
                        ? colors.primary + '15'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleSelectCategory(cat)}
                >
                  <CatIcon
                    size={20}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryOptionText,
                      {
                        color: isSelected ? colors.primary : colors.textPrimary,
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Icon and Amount */}
            <View
              style={[styles.heroSection, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isIncome
                      ? colors.incomeLight
                      : colors.expenseLight,
                  },
                ]}
              >
                <IconComponent size={32} color={amountColor} />
              </View>

              {isEditMode ? (
                <>
                  {/* Type Toggle */}
                  <View style={styles.typeToggle}>
                    <Pressable
                      style={[
                        styles.typeToggleButton,
                        {
                          backgroundColor:
                            editType === 'expense'
                              ? colors.expense
                              : colors.surface,
                          borderColor:
                            editType === 'expense'
                              ? colors.expense
                              : colors.border,
                        },
                      ]}
                      onPress={() => setEditType('expense')}
                    >
                      <Text
                        style={[
                          styles.typeToggleText,
                          {
                            color:
                              editType === 'expense'
                                ? '#FFFFFF'
                                : colors.textPrimary,
                          },
                        ]}
                      >
                        Expense
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.typeToggleButton,
                        {
                          backgroundColor:
                            editType === 'income'
                              ? colors.income
                              : colors.surface,
                          borderColor:
                            editType === 'income'
                              ? colors.income
                              : colors.border,
                        },
                      ]}
                      onPress={() => setEditType('income')}
                    >
                      <Text
                        style={[
                          styles.typeToggleText,
                          {
                            color:
                              editType === 'income'
                                ? '#FFFFFF'
                                : colors.textPrimary,
                          },
                        ]}
                      >
                        Income
                      </Text>
                    </Pressable>
                  </View>

                  {/* Amount Input */}
                  <View
                    style={[
                      styles.amountInputContainer,
                      { borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.amountPrefix, { color: amountColor }]}>
                      {amountPrefix} $
                    </Text>
                    <TextInput
                      style={[styles.amountInput, { color: amountColor }]}
                      value={editAmount}
                      onChangeText={setEditAmount}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor={colors.textHint}
                    />
                  </View>

                  {/* Merchant Input */}
                  <TextInput
                    style={[
                      styles.merchantInput,
                      {
                        backgroundColor: colors.surfaceSecondary,
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      },
                    ]}
                    value={editMerchant}
                    onChangeText={setEditMerchant}
                    placeholder="Merchant / Description"
                    placeholderTextColor={colors.textHint}
                  />
                </>
              ) : (
                <>
                  <Text style={[styles.amount, { color: amountColor }]}>
                    {amountPrefix}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </Text>

                  <Text
                    style={[styles.merchant, { color: colors.textPrimary }]}
                  >
                    {transaction.merchant}
                  </Text>
                </>
              )}
            </View>

            {/* Details Section */}
            <View
              style={[
                styles.detailsSection,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                Transaction Details
              </Text>

              <Pressable
                style={[
                  styles.detailRow,
                  { borderBottomColor: colors.borderLight },
                ]}
                onPress={handleShowCategoryPicker}
              >
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Category
                </Text>
                <View style={styles.detailValueRow}>
                  <Text style={[styles.detailValue, { color: colors.primary }]}>
                    {displayCategory}
                  </Text>
                  <Text style={[styles.editHint, { color: colors.textHint }]}>
                    ›
                  </Text>
                </View>
              </Pressable>

              <View
                style={[
                  styles.detailRow,
                  { borderBottomColor: colors.borderLight },
                ]}
              >
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Type
                </Text>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: isIncome
                        ? colors.incomeLight
                        : colors.expenseLight,
                    },
                  ]}
                >
                  <Text style={[styles.typeText, { color: amountColor }]}>
                    {isIncome ? 'Income' : 'Expense'}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.detailRow,
                  { borderBottomColor: colors.borderLight },
                ]}
              >
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Date
                </Text>
                <Text
                  style={[styles.detailValue, { color: colors.textPrimary }]}
                >
                  {formattedDate}
                </Text>
              </View>

              <View
                style={[
                  styles.detailRow,
                  { borderBottomColor: colors.borderLight },
                ]}
              >
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Time
                </Text>
                <Text
                  style={[styles.detailValue, { color: colors.textPrimary }]}
                >
                  {formattedTime}
                </Text>
              </View>

              <View
                style={[
                  styles.detailRow,
                  { borderBottomColor: colors.borderLight },
                ]}
              >
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Transaction ID
                </Text>
                <Text
                  style={[
                    styles.detailValueMono,
                    { color: colors.textSecondary },
                  ]}
                >
                  #{transaction.id.slice(0, 12)}...
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            {!isEditMode && (onDelete || onUpdateTransaction) && (
              <View style={styles.actionsSection}>
                {onUpdateTransaction && (
                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleEdit}
                  >
                    <EditIcon size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                )}

                {onUpdateCategory && (
                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.textSecondary },
                    ]}
                    onPress={handleShowCategoryPicker}
                  >
                    <CategoryIcon size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Category</Text>
                  </Pressable>
                )}

                {onDelete && (
                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.expense },
                    ]}
                    onPress={handleDelete}
                  >
                    <DeleteIcon size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
                )}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

export const TransactionDetailModal = memo(TransactionDetailModalComponent);

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
  headerLeftButton: {
    position: 'absolute',
    left: spacing.lg,
    top: spacing.xl,
  },
  headerButtonText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.sm,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.xl,
  },
  closeText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  amount: {
    fontSize: 36,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  merchant: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
  typeToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeToggleButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 2,
  },
  typeToggleText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  amountPrefix: {
    fontSize: 28,
    fontWeight: typography.weight.bold,
    marginRight: spacing.xs,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: typography.weight.bold,
    minWidth: 100,
    textAlign: 'center',
  },
  merchantInput: {
    width: '80%',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    textAlign: 'center',
  },
  detailsSection: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: typography.size.md,
  },
  detailValue: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.lg,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: spacing.lg,
  },
  editHint: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.medium,
  },
  detailValueMono: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    fontFamily: 'Courier',
  },
  typeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  typeText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  categoryPickerContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  categoryPickerContent: {
    paddingBottom: 50,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  categoryOptionText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
});
