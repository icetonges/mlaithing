import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6D28D9', // Deeper, more professional purple
          gold: '#F59E0B',   // Richer gold
          dark: '#1E1B4B',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')], // <--- This is key for nice text
};
export default config;