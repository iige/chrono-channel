/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkPurple: "#201C2B",
        purpleAccent: "#6441A4",
        lightGrey: "#E5E3E8",
        lightPurple: "#E2DBF0"
      }
    },
  },
  plugins: [],
}