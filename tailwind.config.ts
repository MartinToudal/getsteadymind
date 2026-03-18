import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090b0f",
        panel: "#121720",
        panelAlt: "#171d27",
        border: "#232a35",
        text: "#f3f5f7",
        muted: "#9ca8b8",
        accent: "#8ccfb0",
        accentSoft: "#21392f",
        warning: "#d7b87e",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        calm: "0 20px 60px rgba(0, 0, 0, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
