/**
 * TransactionDetailModal Component
 * Modal displaying full transaction details when tapping a transaction
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
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { getCategoryIcon } from '../Icons';
import { triggerLightImpact } from '../../utils/haptics';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
}

function TransactionDetailModalComponent({
  transaction,
  visible,
  onClose,
}: TransactionDetailModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose]);

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const amountPrefix = isIncome ? '+' : '-';
  const IconComponent = getCategoryIcon(transaction.category);

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
        </View>

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

            <Text style={[styles.amount, { color: amountColor }]}>
              {amountPrefix}
              {formatCurrency(Math.abs(transaction.amount))}
            </Text>

            <Text style={[styles.merchant, { color: colors.textPrimary }]}>
              {transaction.merchant}
            </Text>
          </View>

          {/* Details Section */}
          <View
            style={[styles.detailsSection, { backgroundColor: colors.surface }]}
          >
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              Transaction Details
            </Text>

            <View
              style={[
                styles.detailRow,
                { borderBottomColor: colors.borderLight },
              ]}
            >
              <Text
                style={[styles.detailLabel, { color: colors.textSecondary }]}
              >
                Category
              </Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                {transaction.category}
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
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
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
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
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
                #{transaction.id}
              </Text>
            </View>
          </View>
        </ScrollView>
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
});
