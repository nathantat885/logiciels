import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Accent principal de la marque.
        brand: {
          DEFAULT: "#1703ce",
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c6caff",
          300: "#a3a6ff",
          400: "#8079fc",
          500: "#6a55f5",
          600: "#5a36ea",
          700: "#1703ce",
          800: "#1503a6",
          900: "#160a82",
          950: "#0d044d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06)",
        cardlg: "0 10px 40px rgba(13, 4, 77, 0.10)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
