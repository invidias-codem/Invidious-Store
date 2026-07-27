/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        invidious: {
          bg: '#0a0a0a',
          silver: '#c0c0c0',
          border: '#2a2a2a',
          accent: '#8b0000',
        },
      },
      fontFamily: {
        display: ['UnifrakturMaguntia', 'serif'],
        body: ['Inter', 'sans-serif'],
        'gothic-ui': ['Pirata One', 'serif'],
      },
    },
  },
  plugins: [],
};
