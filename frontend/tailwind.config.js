/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f6ff',
          100: '#dceafe',
          200: '#b8d5fb',
          300: '#7aaff6',
          400: '#3a7eef',
          500: '#1a5bcb',
          600: '#1246a0',
          700: '#0d3060',
          800: '#0a2140',
          900: '#061428',
          950: '#030d1a',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#f6f8fb',
          3: '#edf1f7',
        },
        ink: {
          DEFAULT: '#0d1117',
          2: '#24292f',
          3: '#57606a',
          4: '#8c959f',
        },
        accent: '#e63946',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
