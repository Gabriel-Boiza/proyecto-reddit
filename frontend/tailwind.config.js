// tailwind.config.js
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
      './src/styles/**/*.{css,scss}', // si tienes estilos personalizados
    ],
    theme: {
      extend: {
        fontFamily: {
          reddit: ['"IBM Plex Sans"', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  