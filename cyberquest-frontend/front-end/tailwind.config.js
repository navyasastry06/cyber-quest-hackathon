
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1e3a8a',
          light: '#eff6ff',
        }
      },
      animation: {
        'gradient-flow': 'gradientFlow 12s ease infinite',
        'gradient-flow-fast': 'gradientFlow 6s ease infinite',
      },
      keyframes: {
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}