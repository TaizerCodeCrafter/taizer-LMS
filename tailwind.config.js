/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./economics_website_ui_react.jsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Sinhala"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', '"Noto Sans Sinhala"', 'sans-serif'],
        sinhala: ['"Noto Sans Sinhala"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
