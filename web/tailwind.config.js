/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Mode Colors
        dark: {
          background: '#0F0B1E',
          backgroundSecondary: '#1A1528',
          card: '#241F35',
          cardElevated: '#2D2742',
          border: '#3D3550',
          borderLight: '#4A415D',
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#E5E7EB',
          tertiary: '#9CA3AF',
          disabled: '#6B7280',
        },
        // Primary Purple
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Accent Yellow
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      boxShadow: {
        'primary': '0 10px 15px -3px rgba(124, 58, 237, 0.4), 0 4px 6px -2px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.2)',
        'primary-glow': '0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
        'error': '0 10px 15px -3px rgba(239, 68, 68, 0.4), 0 4px 6px -2px rgba(239, 68, 68, 0.3), 0 0 20px rgba(239, 68, 68, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'card-elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

