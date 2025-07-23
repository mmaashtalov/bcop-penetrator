module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1E88E5", dark: "#1564B3" },
        danger: { DEFAULT: "#E53935" },
        warning: { DEFAULT: "#FFB300" },
        success: { DEFAULT: "#43A047" },
      },
    },
  },
  plugins: [],
}; 