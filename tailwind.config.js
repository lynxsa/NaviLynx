/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    // Temporarily disable content scanning to avoid CSS issues
    // "./app/**/*.{js,jsx,ts,tsx}",
    // "./components/**/*.{js,jsx,ts,tsx}",
    // "./screens/**/*.{js,jsx,ts,tsx}",
    // "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  // Temporarily disable NativeWind preset
  // presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6A0DAD',    // rich purple
          light: '#8E44AD',      // lighter purple
          50: '#F3E8FF',
          100: '#E9D5FF', 
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        accent: '#ffffff',
        'bg-light': '#FFFFFF',
        'bg-dark': '#1A1A1A',
        'text-light': '#222222',
        'text-dark': '#EEEEEE',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      spacing: {
        '4.5': '18px',
        '18': '72px',
      },
      borderRadius: {
        'xl-2': '1.25rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6A0DAD 0%, #8E44AD 100%)',
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [],
};
