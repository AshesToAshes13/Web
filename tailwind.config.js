module.exports = {
  content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-1': '-1'
      },
      colors: {
        'light-gray': '#F4F5F7'
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif']
      },
      flexGrow: {
        5: '5'
      },
      maxHeight: {
        'screen-menu': 'calc(100vh - 3.5rem)',
        modal: 'calc(100vh - 160px)'
      },
      transitionProperty: {
        position: 'right, left, top, bottom, margin, padding',
        textColor: 'color'
      },
      keyframes: {
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 }
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      },
      animation: {
        fadeOut: 'fadeOut 250ms ease-in-out',
        fadeIn: 'fadeIn 250ms ease-in-out'
      }
    }
  },
  variants: {
    extend: {
      animation: ['hover', 'group-hover']
    }
  },
  plugins: ['postcss-nesting', require('@tailwindcss/forms')]
}
