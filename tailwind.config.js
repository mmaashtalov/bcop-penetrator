/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        primary: { DEFAULT: "#1E88E5", dark: "#1564B3" },
        danger: { DEFAULT: "#E53935" },
        warning: { DEFAULT: "#FFB300" },
        success: { DEFAULT: "#43A047" },
        secondary: '#374151',
        'bg-light': '#F9FAFB',
        'bg-dark':  '#111827',
      },
      fontFamily: {
        sans: ['Inter','sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}