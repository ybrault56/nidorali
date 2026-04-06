import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E9F3FF",
          100: "#D5E8FF",
          200: "#A7D0FF",
          300: "#7AB7FF",
          400: "#3F8FFF",
          500: "#0F62FE",
          600: "#0B4CCB",
          700: "#08399A",
          800: "#062C76",
          900: "#041D4D",
        },
        shell: "#09101F",
      },
      boxShadow: {
        card: "0 20px 40px -28px rgba(15, 98, 254, 0.35)",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};

export default config;
