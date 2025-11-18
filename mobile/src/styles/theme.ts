// Sistema de Design Mobile - Dark Mode Premium
// Roxo escuro (Primary), Amarelo mostarda (Accent), Dark Backgrounds

export const colors = {
  // Cores Primárias - Roxo Escuro
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed', // Roxo escuro principal
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  // Cores de Accent - Amarelo Mostarda
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Amarelo mostarda principal
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Neutros
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Dark Mode Backgrounds
  dark: {
    background: '#0F0B1E', // Roxo muito escuro - background principal
    backgroundSecondary: '#1A1528', // Roxo escuro - background secundário
    card: '#241F35', // Roxo médio escuro - background de cards
    cardElevated: '#2D2742', // Roxo médio escuro elevado
    border: '#3D3550', // Borda roxa escura
    borderLight: '#4A415D', // Borda roxa mais clara
  },
  
  // Dark Mode Text
  text: {
    primary: '#FFFFFF', // Texto primário branco
    secondary: '#E5E7EB', // Texto secundário cinza claro
    tertiary: '#9CA3AF', // Texto terciário cinza médio
    disabled: '#6B7280', // Texto desabilitado
  },
  
  // Cores Funcionais (adaptadas para dark mode)
  success: '#22c55e',
  successDark: '#16a34a', // Success mais escuro para dark mode
  error: '#ef4444',
  errorDark: '#dc2626', // Error mais escuro para dark mode
  warning: '#f59e0b',
  warningDark: '#d97706', // Warning mais escuro para dark mode
  info: '#3b82f6',
  infoDark: '#2563eb', // Info mais escuro para dark mode
  
  // Base
  white: '#ffffff',
  black: '#000000',
};

export const theme = {
  colors,
  
  // Espaçamento
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  
  // Tipografia
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  
  // Bordas
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  // Sombras (React Native) - Dark Mode Premium
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 6,
    },
    // Glow roxo premium
    primary: {
      shadowColor: '#7c3aed',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    primaryGlow: {
      shadowColor: '#7c3aed',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 10,
    },
    accent: {
      shadowColor: '#f59e0b',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    // Sombras para cards dark
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 5,
    },
    cardElevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 8,
    },
  },
  
  // Gradientes (para uso com LinearGradient se necessário)
  gradients: {
    primary: ['#7c3aed', '#6d28d9', '#5b21b6'],
    primarySubtle: ['#1A1528', '#0F0B1E'],
    card: ['#241F35', '#1A1528'],
  },
};

export type Theme = typeof theme;

