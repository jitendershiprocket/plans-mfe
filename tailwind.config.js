/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],

  /**
   * Scope all Tailwind utilities to the <plans-mfe-root> custom element
   * so that SR_Web (shell) global CSS cannot override them.
   *
   * This generates selectors like:
   *   plans-mfe-root .flex { display: flex; }
   * instead of:
   *   .flex { display: flex; }
   *
   * Ensure the shell always renders the microfrontend inside <plans-mfe-root>.
   */
  important: 'plans-mfe-root',

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
  plugins: [],
}

