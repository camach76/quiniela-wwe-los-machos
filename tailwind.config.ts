import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/presentation/**/*.{ts,tsx}",
    "./src/backend/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        quicksand: ['var(--font-quicksand)'],
      },
    },
  },
  plugins: [],
};

export default config;
