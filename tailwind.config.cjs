/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        cal: {
          50: "#F2F2F2",
          100: "#E6E6E6",
          200: "#C9C9C9",
          300: "#B0B0B0",
          400: "#949494",
          500: "#7A7A7A",
          600: "#616161",
          700: "#454545",
          800: "#2B2B2B",
          900: "#101010",
          950: "#080808",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
