import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8B5CF6', // Primary AI/ML Brand
          gold: '#F5C518',   // Site Accent
        },
      },
    },
  },
  plugins: [],
};
export default config;