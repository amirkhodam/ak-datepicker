import theme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'ak-',
  content: ['./src/**/*.{html,js,vue,ts}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    spacing: {
      '0.5': '0.125rem',
      '1': '0.5rem',
      '3': '0.75rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '60': '15rem',
      '96': '24rem',
      '112': '28rem',
      '132': '33rem'
    },
    extend: {}
  },
  plugins: [
    function({ addVariant, e }) {
      addVariant('ak_datepicker', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`ak_datepicker${separator}${className}`)} [data-ak-datepicker]`
        })
      })
    }
  ]
}
