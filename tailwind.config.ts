import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hanken: ["var(--font-hanken)", "sans-serif"],
      },
      colors: {
        blue: {
          accent: "#74a8ed",
          light: "#afc6e5",
        },
        gray: {
          muted: "#9d9d9d",
          border: "#cccccc",
        },
        off: {
          white: "#f8f8f7",
        },
        red: {
          accent: "#ed7474",
        },
      },
      maxWidth: {
        content: "1280px",
      },
      height: {
        header: "115px",
      },
      keyframes: {
        curtainDown: {
          "0%": { maxHeight: "115px" },
          "100%": { maxHeight: "100vh" },
        },
        curtainUp: {
          "0%": { maxHeight: "100vh" },
          "100%": { maxHeight: "115px" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        curtainDown: "curtainDown 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        curtainUp: "curtainUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        fadeIn: "fadeIn 0.3s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
