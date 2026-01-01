import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body: ["'Source Sans Pro'", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f0f4f8",
          100: "#dce5ef",
          200: "#c0d0e2",
          300: "#9cb3ce",
          400: "#7692b7",
          500: "#5d79a0",
          600: "#4d6388",
          700: "#405171",
          800: "#38465e",
          900: "#323c4f"
        }
      }
    }
  },
  plugins: []
};

export default config;
