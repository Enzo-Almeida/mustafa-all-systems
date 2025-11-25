// Sistema de Design - Dark Mode Premium
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
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },
  
  // Base
  white: '#ffffff',
  black: '#000000',
};

export const theme = {
  colors,
  
  // Gradientes (Dark Mode Premium)
  gradients: {
    primary: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    primaryToAccent: 'linear-gradient(135deg, #7c3aed 0%, #f59e0b 100%)',
    dark: 'linear-gradient(135deg, #1A1528 0%, #0F0B1E 100%)',
    darkCard: 'linear-gradient(135deg, #241F35 0%, #1A1528 100%)',
    primaryGlow: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0.1) 100%)',
  },
  
  // Sombras (Dark Mode Premium com Glow)
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
    primary: '0 10px 15px -3px rgba(124, 58, 237, 0.4), 0 4px 6px -2px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.2)',
    primaryGlow: '0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
    accent: '0 10px 15px -3px rgba(245, 158, 11, 0.4), 0 4px 6px -2px rgba(245, 158, 11, 0.3)',
    error: '0 10px 15px -3px rgba(239, 68, 68, 0.4), 0 4px 6px -2px rgba(239, 68, 68, 0.3), 0 0 20px rgba(239, 68, 68, 0.2)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    cardElevated: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  },
  
  // Tipografia
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Espaçamento
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Bordas
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Transições
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
};

export type Theme = typeof theme;

