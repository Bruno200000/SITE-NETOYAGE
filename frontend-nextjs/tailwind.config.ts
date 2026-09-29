import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0b63ce",
          navy: "#0b1020",
          ink: "#07111f",
          green: "#16a34a",
          orange: "#ff7a1a",
          mint: "#dff8ec",
          sky: "#eef7ff"
        }
      },
      boxShadow: {
        premium: "0 24px 80px rgba(8, 52, 95, 0.14)",
        glow: "0 18px 45px rgba(255, 122, 26, 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
