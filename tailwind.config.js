/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Kalpurush'", 'system-ui', 'sans-serif'],
      },
      colors: {
        brsp: {
          ink: '#0a3631',
          green: '#00694d',
          red: '#c8283a',
        },
      },
    },
  },
  plugins: [],
};
