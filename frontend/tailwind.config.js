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
        primary: {
          DEFAULT: '#A855F7', // Vibrant Violet
          container: '#3B0764', // Deep Violet container
          light: '#D8B4FE',
        },
        secondary: {
          DEFAULT: '#06B6D4', // Vibrant Cyan
          container: '#083344',
          light: '#67E8F9',
        },
        tertiary: {
          DEFAULT: '#F43F5E', // Rose accent
          container: '#4C0519',
          light: '#FDA4AF',
        },
        surface: {
          DEFAULT: '#121214', // Sleek dark surface
          variant: '#1E1E24', // Card surface
          outline: '#2D2D39', // Outline borders
        },
        background: {
          DEFAULT: '#0A0A0C', // Absolute dark background
        },
        textColor: {
          primary: '#F8FAFC', // Slate 50
          secondary: '#94A3B8', // Slate 400
          disabled: '#64748B', // Slate 500
        }
      },
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.2), 0px 1px 2px 0px rgba(0, 0, 0, 0.4)',
        'elevation-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.25), 0px 1px 2px 0px rgba(0, 0, 0, 0.45)',
        'elevation-3': '0px 4px 12px 4px rgba(0, 0, 0, 0.3), 0px 2px 4px 0px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'm3-none': '0px',
        'm3-xs': '4px',
        'm3-sm': '8px',
        'm3-md': '12px',
        'm3-lg': '16px',
        'm3-xl': '28px',
        'm3-full': '9999px',
      }
    },
  },
  plugins: [],
}
