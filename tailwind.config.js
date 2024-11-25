/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        blanco: {
          DEFAULT: '#FFFFFF'
        },
        negro: {
          DEFAULT: '#000000'
        },
        rosa: {
          DEFAULT: '#E88EED'
        },
        morado: {
          DEFAULT: '#690375'
        },
        azul: {
          DEFAULT: '#02A9EA'
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
