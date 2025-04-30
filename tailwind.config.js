/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'inter': ['Inter', 'sans-serif'],
          'poppins': ['Poppins', 'sans-serif'],
          'vujahday': ['Vujahday Script', 'cursive'],
          custom: ['HolidayFree', 'cursive'],
        },
        animation: {
          fadeIn: 'fadeIn 2s ease-out', // Define the animation
          fadeInDelay: 'fadeIn 1.5s ease-out 0.5s', // Define the delayed animation
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
        },
      },
    },
    plugins: [],
    
  }
  