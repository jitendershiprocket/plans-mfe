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
      /**
       * IMPORTANT:
       * SR_Web sets `html, body { font-size: 12px; }`, so Tailwind's default `rem`-based
       * font sizes shrink when the MFE is embedded (e.g. `text-sm` 0.875rem => 10.5px).
       *
       * To make typography consistent in standalone + embedded modes, override Tailwind's
       * standard text sizes to `px` values.
       */
      fontSize: {
        xs: ['12px'],
        sm: ['14px'],
        base: ['16px'],
        lg: ['18px'],
        xl: ['20px'],
        '2xl': ['24px'],
        '3xl': ['30px'],
        '4xl': ['36px'],
        '5xl': ['48px'],
        '6xl': ['60px'],
        '7xl': ['72px'],
        '8xl': ['96px'],
        '9xl': ['128px'],
      },
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

