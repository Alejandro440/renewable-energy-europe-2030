/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'status-target':  '#1b5e20',
        'status-on':      '#2e7d32',
        'status-needs':   '#e65100',
        'status-behind':  '#b71c1c',
        'eu-blue':        '#003399',
        'accent-gold':    '#FFCC00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
