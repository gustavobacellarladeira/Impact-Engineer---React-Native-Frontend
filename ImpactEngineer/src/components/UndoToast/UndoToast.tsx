/**
 * UndoToast Component
 * Toast notification with undo action for deleted transactions
 */

import React, { memo, useEffect, useRef } from 'react';
import { StyleSheet, Text, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography, shadows } from '../../theme';
import { triggerSuccess } from '../../utils/haptics';

interface UndoToastProps {
  visible: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

function UndoToastComponent({
  visible,
  message,
  onUndo,
  onDismiss,
  duration = 5000,
}: UndoToastProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after duration
      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    } else {
      // Hide toast
      hideToast();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 100,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (visible) {
        onDismiss();
      }
    });
  };

  const handleUndo = () => {
    triggerSuccess();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onUndo();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          bottom: insets.bottom + spacing.lg,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text
        style={[styles.message, { color: colors.textPrimary }]}
        numberOfLines={1}
      >
        {message}
      </Text>
      <Pressable
        style={[styles.undoButton, { backgroundColor: colors.primary }]}
        onPress={handleUndo}
        accessibilityRole="button"
        accessibilityLabel="Undo delete"
      >
        <Text style={styles.undoText}>Undo</Text>
      </Pressable>
    </Animated.View>
  );
}

export const UndoToast = memo(UndoToastComponent);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...shadows.lg,
  },
  message: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    marginRight: spacing.md,
  },
  undoButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  undoText: {
    color: '#FFFFFF',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
