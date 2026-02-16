
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./index.tsx", "./**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5B7C8D',
        background: '#F6F7F8',
        surface: '#FFFFFF',
        softRed: '#C46A6A',
        darkBg: '#1F2937',
      },
      borderRadius: {
        card: '14px',
        btn: '10px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'breathing': 'breathing 3s ease-in-out infinite',
        'fade-out': 'fadeOut 0.5s forwards',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)', display: 'none' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
