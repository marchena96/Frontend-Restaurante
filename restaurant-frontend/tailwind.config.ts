import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores de marca del restaurante
        brand: {
          primary: '#8B4513',   // Marrón oscuro (madera)
          secondary: '#D2691E', // Marrón claro
          accent: '#FFD700',    // Oro
          dark: '#1a1a1a',
          light: '#f5f5f5',
        },
      },
      spacing: {
        'sidebar': '16rem',
      },
    },
  },
  plugins: [],
}

export default config
