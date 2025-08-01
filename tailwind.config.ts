import { type Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", // if you use src folder
    "./node_modules/@shadcn/ui/**/*.{ts,tsx}", // Add this if using shadcn/ui
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
