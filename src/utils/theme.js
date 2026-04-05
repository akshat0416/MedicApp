// MedicApp Design Tokens — Teal/Green Medical Theme

export const LIGHT_COLORS = {
  isDark: false,
  // Primary palette (Teal)
  primary: '#0D9488',
  primaryLight: '#14B8A6',
  primaryDark: '#0F766E',
  primaryGhost: 'rgba(13, 148, 136, 0.08)',
  primaryGhostBorder: 'rgba(13, 148, 136, 0.18)',

  // Accent
  accent: '#06B6D4',
  accentLight: '#67E8F9',

  // Semantic
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',

  // Neutrals
  white: '#FFFFFF',
  background: '#F0FDFA',
  surface: '#FFFFFF',
  surfaceElevated: '#F0FDFA',
  border: '#CCFBF1',
  borderLight: '#F0FDFA',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  // Gradients (used as array)
  gradientPrimary: ['#0D9488', '#0F766E'],
  gradientAccent: ['#14B8A6', '#06B6D4'],
  gradientWarm: ['#F59E0B', '#EF4444'],
  gradientHeader: ['#0D9488', '#0F766E'],
};

export const DARK_COLORS = {
  isDark: true,
  // Primary palette (Teal — slightly lighter for dark bg)
  primary: '#14B8A6',
  primaryLight: '#2DD4BF',
  primaryDark: '#0D9488',
  primaryGhost: 'rgba(20, 184, 166, 0.12)',
  primaryGhostBorder: 'rgba(20, 184, 166, 0.25)',

  // Accent
  accent: '#22D3EE',
  accentLight: '#67E8F9',

  // Semantic
  success: '#34D399',
  successLight: 'rgba(52, 211, 153, 0.15)',
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.15)',
  danger: '#F87171',
  dangerLight: 'rgba(248, 113, 113, 0.15)',

  // Neutrals
  white: '#FFFFFF',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#1E293B',
  border: '#334155',
  borderLight: '#1E293B',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  textOnPrimary: '#FFFFFF',

  // Gradients
  gradientPrimary: ['#0D9488', '#0F766E'],
  gradientAccent: ['#14B8A6', '#06B6D4'],
  gradientWarm: ['#F59E0B', '#EF4444'],
  gradientHeader: ['#134E4A', '#0F766E'],
};

// Backward-compatible default export
export const COLORS = LIGHT_COLORS;

// Helper: get theme colors
export const getTheme = (isDark) => (isDark ? DARK_COLORS : LIGHT_COLORS);

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  colored: {
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};
