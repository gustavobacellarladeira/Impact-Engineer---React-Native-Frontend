/**
 * Haptic Feedback Utility
 * Provides consistent haptic feedback across the app for various interactions
 */

import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';

// Configuration for haptic feedback
const hapticOptions = {
  enableVibrateFallback: true, // Fallback to vibration on Android
  ignoreAndroidSystemSettings: false, // Respect system haptic settings
};

/**
 * Trigger a light impact haptic feedback
 * Use for: Selection changes, toggles, small UI interactions
 */
export const triggerLightImpact = () => {
  ReactNativeHapticFeedback.trigger(
    HapticFeedbackTypes.impactLight,
    hapticOptions,
  );
};

/**
 * Trigger a medium impact haptic feedback
 * Use for: Button presses, confirming actions
 */
export const triggerMediumImpact = () => {
  ReactNativeHapticFeedback.trigger(
    HapticFeedbackTypes.impactMedium,
    hapticOptions,
  );
};

/**
 * Trigger a heavy impact haptic feedback
 * Use for: Important actions, completing tasks
 */
export const triggerHeavyImpact = () => {
  ReactNativeHapticFeedback.trigger(
    HapticFeedbackTypes.impactHeavy,
    hapticOptions,
  );
};

/**
 * Trigger a selection feedback
 * Use for: Picker selections, scrolling through lists
 */
export const triggerSelection = () => {
  ReactNativeHapticFeedback.trigger(
    HapticFeedbackTypes.selection,
    hapticOptions,
  );
};

/**
 * Trigger a success notification feedback
 * Use for: Successful completions, confirmations
 */
export const triggerSuccess = () => {
  ReactNativeHapticFeedback.trigger(
    HapticFeedbackTypes.notificationSuccess,
    hapticOptions,
  );
};

/**
 * Trigger a warning notification feedback
 * Use for: Warnings, alerts
 */
export const triggerWarning = () => {
  ReactNativeHapticFeedback.trigger(
    HapticFeedbackTypes.notificationWarning,
    hapticOptions,
  );
};

/**
 * Trigger an error notification feedback
 * Use for: Errors, failures
 */
export const triggerError = () => {
  ReactNativeHapticFeedback.trigger(
    HapticFeedbackTypes.notificationError,
    hapticOptions,
  );
};

/**
 * Trigger a soft impact feedback
 * Use for: Subtle UI feedback, hover-like effects
 */
export const triggerSoft = () => {
  ReactNativeHapticFeedback.trigger(HapticFeedbackTypes.soft, hapticOptions);
};

/**
 * Trigger a rigid impact feedback
 * Use for: More pronounced UI feedback
 */
export const triggerRigid = () => {
  ReactNativeHapticFeedback.trigger(HapticFeedbackTypes.rigid, hapticOptions);
};

// Export all haptic functions as a namespace for convenience
export const Haptics = {
  lightImpact: triggerLightImpact,
  mediumImpact: triggerMediumImpact,
  heavyImpact: triggerHeavyImpact,
  selection: triggerSelection,
  success: triggerSuccess,
  warning: triggerWarning,
  error: triggerError,
  soft: triggerSoft,
  rigid: triggerRigid,
};

export default Haptics;
