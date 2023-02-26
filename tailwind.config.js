/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"]
    },
      colors: {
        twitchDarkPurple: "#201C2B",
        twitchPurple: "#6441A4",
        twitchLightGrey: "#E5E3E8",
        twitchLightPurple: "#E2DBF0"
      }
    },
  },
  plugins: [],
}