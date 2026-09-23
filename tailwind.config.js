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
        brand: {
          50: '#FDF8F3',
          100: '#F7EDE1',
          200: '#EFDAC4',
          300: '#E4C2A1',
          400: '#D7A779',
          500: '#C98A4B', // Core Amber / Caramel Crema
          600: '#B27339',
          700: '#94582C',
          800: '#754323',
          900: '#5A331C',
          950: '#341B0E',
        },
        espresso: {
          50: '#F4F4F5',
          100: '#E4E4E7',
          200: '#D4D4D8',
          300: '#A1A1AA',
          400: '#71717A',
          500: '#52525B',
          600: '#3F3F46',
          700: '#27272A',
          800: '#18181B',
          900: '#121214',
          950: '#09090B',
        },
        canvas: {
          base: '#FAF7F2',
          card: '#FFFFFF',
          subtle: '#F4EFEA',
          border: '#E8E2D9',
        },
        darkcanvas: {
          base: '#0E0E10',
          card: '#161619',
          subtle: '#202025',
          border: '#2A2A32',
        }
      },
      fontFamily: {
        display: ['"Alexandria"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        sans: ['"Outfit"', '"Readex Pro"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(24, 24, 27, 0.05)',
        'float': '0 12px 32px -4px rgba(24, 24, 27, 0.12)',
        'glow': '0 0 24px -2px rgba(201, 138, 75, 0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
