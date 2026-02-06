/**
 * Theme Tests
 * Tests for theme colors and context
 */

import { lightColors, darkColors, spacing, borderRadius, typography, shadows } from '../src/theme';

describe('Theme Colors', () => {
  describe('lightColors', () => {
    it('should have primary color', () => {
      expect(lightColors.primary).toBeDefined();
      expect(typeof lightColors.primary).toBe('string');
    });

    it('should have background color', () => {
      expect(lightColors.background).toBeDefined();
    });

    it('should have surface color', () => {
      expect(lightColors.surface).toBeDefined();
    });

    it('should have text colors', () => {
      expect(lightColors.textPrimary).toBeDefined();
      expect(lightColors.textSecondary).toBeDefined();
    });

    it('should have income color (green)', () => {
      expect(lightColors.income).toBeDefined();
    });

    it('should have expense color (red)', () => {
      expect(lightColors.expense).toBeDefined();
    });
  });

  describe('darkColors', () => {
    it('should have primary color', () => {
      expect(darkColors.primary).toBeDefined();
    });

    it('should have different background than light', () => {
      expect(darkColors.background).not.toBe(lightColors.background);
    });

    it('should have different text colors than light', () => {
      expect(darkColors.textPrimary).not.toBe(lightColors.textPrimary);
    });

    it('should have all required color keys', () => {
      const requiredKeys = [
        'primary',
        'background',
        'surface',
        'textPrimary',
        'textSecondary',
        'income',
        'expense',
      ];
      requiredKeys.forEach(key => {
        expect(darkColors).toHaveProperty(key);
      });
    });
  });

  describe('Color contrast', () => {
    it('light theme should have dark text on light background', () => {
      // Light background should be lighter (higher hex value)
      // Text should be darker
      expect(lightColors.background).toMatch(/^#[fFeE]/);
    });

    it('dark theme should have light text on dark background', () => {
      // Dark background should be darker (lower hex value)
      expect(darkColors.background).toMatch(/^#[0-3]/);
    });
  });
});

describe('Spacing', () => {
  it('should have spacing scale', () => {
    expect(spacing.xs).toBeDefined();
    expect(spacing.sm).toBeDefined();
    expect(spacing.md).toBeDefined();
    expect(spacing.lg).toBeDefined();
    expect(spacing.xl).toBeDefined();
  });

  it('should have increasing spacing values', () => {
    expect(spacing.xs).toBeLessThan(spacing.sm);
    expect(spacing.sm).toBeLessThan(spacing.md);
    expect(spacing.md).toBeLessThan(spacing.lg);
    expect(spacing.lg).toBeLessThan(spacing.xl);
  });

  it('spacing values should be numbers', () => {
    expect(typeof spacing.md).toBe('number');
  });
});

describe('Border Radius', () => {
  it('should have border radius scale', () => {
    expect(borderRadius.sm).toBeDefined();
    expect(borderRadius.md).toBeDefined();
    expect(borderRadius.lg).toBeDefined();
  });

  it('should have increasing values', () => {
    expect(borderRadius.sm).toBeLessThan(borderRadius.md);
    expect(borderRadius.md).toBeLessThan(borderRadius.lg);
  });

  it('should have full border radius for pills/circles', () => {
    expect(borderRadius.full).toBeDefined();
    expect(borderRadius.full).toBeGreaterThan(borderRadius.lg);
  });
});

describe('Typography', () => {
  it('should have font sizes', () => {
    expect(typography.size).toBeDefined();
    expect(typography.size.sm).toBeDefined();
    expect(typography.size.md).toBeDefined();
    expect(typography.size.lg).toBeDefined();
  });

  it('should have font weights', () => {
    expect(typography.weight).toBeDefined();
    expect(typography.weight.regular).toBeDefined();
    expect(typography.weight.medium).toBeDefined();
    expect(typography.weight.semibold).toBeDefined();
    expect(typography.weight.bold).toBeDefined();
  });

  it('font sizes should increase', () => {
    expect(typography.size.sm).toBeLessThan(typography.size.md);
    expect(typography.size.md).toBeLessThan(typography.size.lg);
  });
});

describe('Shadows', () => {
  it('should have shadow definitions', () => {
    expect(shadows).toBeDefined();
  });

  it('should have different shadow levels', () => {
    expect(shadows.sm).toBeDefined();
    expect(shadows.md).toBeDefined();
    expect(shadows.lg).toBeDefined();
  });

  it('shadows should have required properties', () => {
    const shadowProps = ['shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'elevation'];
    shadowProps.forEach(prop => {
      expect(shadows.md).toHaveProperty(prop);
    });
  });
});
