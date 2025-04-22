import React, {createContext, useContext, ReactNode, useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {Colors} from '../theme/colors';

interface ThemeContextType {
  colors: typeof Colors.light | typeof Colors.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const colorScheme = useColorScheme();
  const colors = useMemo(() => Colors[colorScheme || 'light'], [colorScheme]);

  return (
    <ThemeContext.Provider value={{colors}}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
