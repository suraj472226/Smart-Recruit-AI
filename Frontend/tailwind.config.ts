import type { Config } from "tailwindcss" with { "resolution-mode": "import" };

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Customizations will be added 
    },
  },
  darkMode: "class",
  plugins: [],
};

export default config;
