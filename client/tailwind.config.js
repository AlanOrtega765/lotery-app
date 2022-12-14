/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      gray: '#CACACA',
      'light-gray': '#D9D9D9',
      'very-light-gray': '#F9F9F9',
      red: '#FF0000',
      'soft-red': '#D75050',
      'very-soft-red': '#E05C5C',
      green: '#42FF00',
      'just-white': '#FFFFFF',
      'just-black': '#000000',
      'soft-black': '#000000CC',
      error: '#C70039',
      warning: '#FF5733',
      transparent: 'transparent'
    },
    fontFamily: {
      raleway: ['Raleway', 'sans-serif'],
      'sans-serif': 'sans-serif',
    },
    fontSize: {
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '20px',
      '2xl': '32px',
      '3xl': '36px',
      '4xl': '40px',
    },
    dropShadow: {
      1: '0 0 5px rgba(0, 0, 0, 0.25)',
    },
    extend: {
      boxShadow: {
        inner: 'inset 0 0 4px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
