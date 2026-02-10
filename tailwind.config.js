/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scope Tailwind utilities to the custom element so they don't affect the host app (SR_Web)
  // This generates rules like: plans-mfe-root .class { ... !important }
  important: 'plans-mfe-root',
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
  // Disable Tailwind's global reset since this MFE is embedded inside another app
  corePlugins: {
    preflight: false,
  },
  plugins: [ ],
}

