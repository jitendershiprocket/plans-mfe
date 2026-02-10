/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure Tailwind utilities win over host app (SR_Web) styles when embedded
  // This adds !important to Tailwind utilities so SR_Web CSS can't override them
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#673ab7',
          light: '#9575cd',
          dark: '#512da8',
        },
        success: '#4caf50',
        warning: '#ffc107',
        danger: '#f44336',
      },
      fontFamily: {
        'sf-pro-regular': ['SFProDisplay-Regular'],
        'sf-pro-medium': ['SFProDisplay-Medium'],
        'sf-pro-bold': ['SFProDisplay-Bold'],
      },
    },
  },
  plugins: [ ],
}

