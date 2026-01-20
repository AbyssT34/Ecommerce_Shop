/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Layers
        'bg-primary': '#0F172A',      // Slate 900
        'bg-secondary': '#1E293B',    // Slate 800
        'bg-tertiary': '#334155',     // Slate 700

        // Primary (Blue)
        primary: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },

        // Secondary (Orange)
        secondary: {
          500: '#F97316',
          600: '#EA580C',
        },

        // Accent (Teal/Cyan)
        accent: {
          teal: '#14B8A6',
          cyan: '#06B6D4',
        },

        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Text Colors
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
    },
  },
  plugins: [],
}
