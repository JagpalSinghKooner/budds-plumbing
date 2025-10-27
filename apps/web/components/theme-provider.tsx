'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Return default values when used outside provider (e.g., during SSR)
    return {
      theme: 'system' as Theme,
      setTheme: () => {},
      resolvedTheme: 'light' as 'light' | 'dark',
    };
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  // Get system theme preference
  const getSystemTheme = React.useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    // eslint-disable-next-line no-undef
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  // Calculate resolved theme
  const resolvedTheme = React.useMemo(() => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  }, [theme, getSystemTheme]);

  // Apply theme to document
  const applyTheme = React.useCallback(
    (newTheme: 'light' | 'dark') => {
      // eslint-disable-next-line no-undef
      const root = document.documentElement;

      if (attribute === 'class') {
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
      } else {
        root.setAttribute(attribute, newTheme);
      }
    },
    [attribute]
  );

  // Load theme from localStorage on mount
  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    const stored = localStorage.getItem('theme') as Theme | null;
    if (
      stored &&
      (stored === 'light' || stored === 'dark' || stored === 'system')
    ) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  // Apply theme when it changes
  React.useEffect(() => {
    if (!mounted) return;
    applyTheme(resolvedTheme);
  }, [resolvedTheme, mounted, applyTheme]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (!mounted || !enableSystem || theme !== 'system') return;

    // eslint-disable-next-line no-undef
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, enableSystem, theme, getSystemTheme, applyTheme]);

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    // eslint-disable-next-line no-undef
    localStorage.setItem('theme', newTheme);
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme]
  );

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
