
export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  surface: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  textBody: string;
  grey: string;
  icon: string;
  success: string;
  warning: string;
  error: string;
  black: string;
  white: string;
  pink: string;
}

// Light theme colors
const lightThemeColors: ThemeColors = {
  background: '#FFFFFF',
  backgroundSecondary: '#F6F6F6',
  surface: '#F6F6F6',
  primary: '#175C37',
  primaryLight: '#E7EEEB',
  secondary: '#27C06C',
  textPrimary: '#202123',
  textSecondary: '#989EB1',
  textBody: '#444444',
  grey: '#E3E3E4',
  icon: '#444444',
  success: '#1B9E56',
  warning: '#FF6624',
  error: '#E61610',
  black: '#000000',
  white: '#ffffff',
  pink: '#FAD5D4',
};

// Dark theme colors
const darkThemeColors: ThemeColors = {
  background: '#FFFFFF',
  backgroundSecondary: '#F6F6F6',
  surface: '#F6F6F6',
  primary: '#175C37',
  primaryLight: '#E7EEEB',
  secondary: '#27C06C',
  textPrimary: '#202123',
  textSecondary: '#989EB1',
  textBody: '#444444',
  grey: '#E3E3E4',
  icon: '#444444',
  success: '#1B9E56',
  warning: '#FF6624',
  error: '#E61610',
  black: '#000000',
  pink: '#FAD5D4',
  white: '#ffffff',
};

type ThemeType = 'light' | 'dark';

export const Colors: Record<ThemeType, ThemeColors> = Object.freeze({
  light: lightThemeColors,
  dark: darkThemeColors,
} as const);

export type ColorTheme = typeof lightThemeColors;
export type ColorKey = keyof ColorTheme;