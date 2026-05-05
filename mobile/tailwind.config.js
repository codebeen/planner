/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#ec4899',
        secondary: '#db2777',
        pink50: '#fdf2f8',
        pink100: '#fce7f3',
        pink200: '#fbcfe8',
        pink300: '#f9a8d4',
        pink400: '#f472b6',
        pink500: '#ec4899',
        pink600: '#db2777',
        pink700: '#be185d',
      }
    },
  },
  plugins: [],
}
