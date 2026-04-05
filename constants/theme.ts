import { Platform } from 'react-native';

// Warm beige + purple palette — inspired by modern wellness apps
export const Colors = {
  light: {
    primary: '#BE78F0',
    primaryLight: '#D4A3F7',
    accent: '#A855E8',
    background: '#F5F0EB',
    surface: '#FFFFFF',
    surfaceAlt: '#EDE8E3',
    border: '#E2DDD7',
    text: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textMuted: '#9B9590',
    success: '#5CB85C',
    warm: '#E8985A',
    tint: '#BE78F0',
    icon: '#9B9590',
    tabIconDefault: '#9B9590',
    tabIconSelected: '#BE78F0',
    tabBarBg: '#FFFFFF',
  },
  dark: {
    primary: '#BE78F0',
    primaryLight: '#D4A3F7',
    accent: '#A855E8',
    background: '#1A1714',
    surface: '#262220',
    surfaceAlt: '#2E2A27',
    border: '#3A3532',
    text: '#F0EBE6',
    textSecondary: '#C5BFB8',
    textMuted: '#7A756F',
    success: '#66BB6A',
    warm: '#E8985A',
    tint: '#BE78F0',
    icon: '#7A756F',
    tabIconDefault: '#7A756F',
    tabIconSelected: '#BE78F0',
    tabBarBg: '#262220',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
