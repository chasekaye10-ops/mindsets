import { Platform } from 'react-native';

// Bright purple palette
export const Colors = {
  light: {
    primary: '#BE78F0',
    primaryLight: '#D4A3F7',
    accent: '#A855E8',
    background: '#FFFFFF',
    surface: '#FCF8FF',
    border: '#ECDDF5',
    text: '#2D2640',
    textMuted: '#9490A8',
    success: '#4CAF50',
    warm: '#FF9800',
    tint: '#BE78F0',
    icon: '#9490A8',
    tabIconDefault: '#9490A8',
    tabIconSelected: '#BE78F0',
  },
  dark: {
    primary: '#A78BFA',
    primaryLight: '#C4B5FD',
    accent: '#9B7EF9',
    background: '#121212',
    surface: '#1E1C26',
    border: '#332F40',
    text: '#E8E4F2',
    textMuted: '#8E8A9E',
    success: '#66BB6A',
    warm: '#FFB74D',
    tint: '#A78BFA',
    icon: '#8E8A9E',
    tabIconDefault: '#8E8A9E',
    tabIconSelected: '#A78BFA',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
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
