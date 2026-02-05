/**
 * Haptics Utility Tests
 * Tests for the haptic feedback utilities
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  triggerLightImpact,
  triggerMediumImpact,
  triggerHeavyImpact,
  triggerSelection,
  triggerSuccess,
  triggerWarning,
  triggerError,
} from '../src/utils/haptics';

// Mock the haptic feedback library
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
  HapticFeedbackTypes: {
    impactLight: 'impactLight',
    impactMedium: 'impactMedium',
    impactHeavy: 'impactHeavy',
    selection: 'selection',
    notificationSuccess: 'notificationSuccess',
    notificationWarning: 'notificationWarning',
    notificationError: 'notificationError',
  },
}));

describe('Haptics Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('triggerLightImpact', () => {
    it('should trigger light impact feedback', () => {
      triggerLightImpact();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        'impactLight',
        expect.any(Object)
      );
    });
  });

  describe('triggerMediumImpact', () => {
    it('should trigger medium impact feedback', () => {
      triggerMediumImpact();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        'impactMedium',
        expect.any(Object)
      );
    });
  });

  describe('triggerHeavyImpact', () => {
    it('should trigger heavy impact feedback', () => {
      triggerHeavyImpact();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        'impactHeavy',
        expect.any(Object)
      );
    });
  });

  describe('triggerSelection', () => {
    it('should trigger selection feedback', () => {
      triggerSelection();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        'selection',
        expect.any(Object)
      );
    });
  });

  describe('triggerSuccess', () => {
    it('should trigger success notification feedback', () => {
      triggerSuccess();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        'notificationSuccess',
        expect.any(Object)
      );
    });
  });

  describe('triggerWarning', () => {
    it('should trigger warning notification feedback', () => {
      triggerWarning();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        'notificationWarning',
        expect.any(Object)
      );
    });
  });

  describe('triggerError', () => {
    it('should trigger error notification feedback', () => {
      triggerError();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        'notificationError',
        expect.any(Object)
      );
    });
  });

  describe('haptic options', () => {
    it('should pass correct options to trigger', () => {
      triggerLightImpact();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        })
      );
    });
  });
});
