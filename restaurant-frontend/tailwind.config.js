/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: '#0d0d0d',
          panel: '#1a1a1a',
          elevated: '#242424',
          muted: '#1f1f1f',
        },
        border: {
          DEFAULT: '#2a2a2a',
          subtle: '#222222',
        },
        gold: {
          DEFAULT: '#c9a96e',
          strong: '#b8942e',
          muted: 'rgba(201, 169, 110, 0.15)',
          glow: 'rgba(201, 169, 110, 0.08)',
        },
        cream: {
          DEFAULT: '#faf7f2',
          muted: '#e8e4de',
        },
        text: {
          DEFAULT: '#faf7f2',
          muted: '#8a8580',
          dim: '#5a5550',
        },
        error: '#e74c3c',
        warning: '#d4a843',
        success: '#2ecc71',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.4)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'lg': '0 12px 40px rgba(0, 0, 0, 0.6)',
        'gold': '0 0 20px rgba(201, 169, 110, 0.1)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
