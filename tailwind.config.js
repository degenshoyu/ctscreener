// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        sidebar: "#202232",
        sidebarBorder: "#414670",
        mainBg: "#191B2A",
      },
    },
  },
};
