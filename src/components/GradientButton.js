import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const GradientButton = ({ title, onPress, loading, disabled, style, variant = 'primary', theme }) => {
  const T = theme || COLORS;

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[styles.outlineButton, { borderColor: T.primary, backgroundColor: T.primaryGhost }, disabled && styles.disabledOutline, style]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator color={T.primary} />
        ) : (
          <Text style={[styles.outlineText, { color: T.primary }, disabled && styles.disabledText]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.wrapper, disabled && styles.disabledWrapper, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      <LinearGradient
        colors={disabled ? ['#CBD5E1', '#94A3B8'] : T.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.colored,
  },
  disabledWrapper: {
    ...SHADOWS.sm,
  },
  gradient: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  text: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  outlineButton: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
  },
  disabledOutline: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
  },
  outlineText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  disabledText: {
    color: COLORS.textTertiary,
  },
});

export default GradientButton;
