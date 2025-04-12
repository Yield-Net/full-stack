import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Optional: Customize theme here
      keyframes: {},
      animation: {},
    },
  },
  plugins: [
    require("tailwindcss-animate"), // ✅ enables animation utilities
  ],
};

export default config;