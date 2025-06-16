// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004080",
        secondary: "#f0f2f5",
        accent: "#ff4d4f",
        moderna: "#e6f7ff",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms")
  ],
}
