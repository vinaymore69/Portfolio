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
          bounce: 'bounce 1s infinite',
          pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          slideUp: 'slideUp 0.6s ease-out',
          slideDown: 'slideDown 0.6s ease-out',
          scaleIn: 'scaleIn 0.4s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          bounce: {
            '0%, 100%': {
              transform: 'translateY(-25%)',
              animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
            },
            '50%': {
              transform: 'translateY(0)',
              animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            },
          },
          pulse: {
            '0%, 100%': {
              opacity: '1',
            },
            '50%': {
              opacity: '.5',
            },
          },
          slideUp: {
            '0%': {
              transform: 'translateY(20px)',
              opacity: '0',
            },
            '100%': {
              transform: 'translateY(0)',
              opacity: '1',
            },
          },
          slideDown: {
            '0%': {
              transform: 'translateY(-20px)',
              opacity: '0',
            },
            '100%': {
              transform: 'translateY(0)',
              opacity: '1',
            },
          },
          scaleIn: {
            '0%': {
              transform: 'scale(0.9)',
              opacity: '0',
            },
            '100%': {
              transform: 'scale(1)',
              opacity: '1',
            },
          },
        },
        scrollBehavior: ['smooth'],
      },
    },
    plugins: [],
    
  }
  