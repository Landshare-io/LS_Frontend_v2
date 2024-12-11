/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "selector",
  theme: {
    extend: {
      backgroundImage: {
        stripes: `linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
        )`,
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        third: "var(--color-third)",
        "vault-input": "var(--color-vault-input)",
        "input-field": "var(--color-input-field)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-third": "var(--color-text-third)",
        "text-fourth": "var(--color-text-fourth)",
        "button-primary": "var(--color-button-primary)",
        "button-secondary": "var(--color-button-secondary)",
        "button-third": "var(--color-button-third)",
        "button-text-primary": "var(--color-button-text-primary)",
        "button-text-secondary": "var(--color-button-text-secondary)",
        "landshare-green": "var(--Landshare-green)"
      },
      screens: {
        xs: "375px",
        sm: "450px",
        md: "768px",
        mlg: "1024px",
        lg: "1280px",
        xl: "1440px",
        xxl: "1680px",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
      keyframes: {
        sparkling: {
          "0%, 100%": { filter: "opacity(0.5)" },
          "50%": { filter: "opacity(1.1)" },
        },
        fadeIn: {
          "0%": { opacity: 0.3 },
          "100%": { opacity: 1 },
        },
        progress: {
          "0%": { "background-position": "0 0" },
          "100%": { "background-position": "1rem 1rem" },
        },
      },
      animation: {
        sparkling: "sparkling 3s infinite",
        fadeIn: "fadeIn 1.2s",
        progress: "progress 1s infinite linear",
      },
    },
  },
  plugins: [],
};
