import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { themes } from '../context/theme';

export function useTheme() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const colors = themes[theme];
  
  return {
    theme,
    toggleTheme,
    colors,
  };
}