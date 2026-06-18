/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: '#f6f7f4',
          panel: '#ffffff',
          muted: '#f0f4ef',
        },
        border: '#d8ddd2',
        accent: {
          DEFAULT: '#1f7a5d',
          strong: '#155943',
        },
        warning: '#b7791f',
        text: {
          DEFAULT: '#26312b',
          muted: '#69756d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
