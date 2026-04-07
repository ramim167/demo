import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#f8f2eb",
        ink: "#182033",
        panel: "#172033",
        accent: "#5b7cfa",
        accentSoft: "#e2e8ff",
        line: "#dfe5f0"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      boxShadow: {
        panel: "0 24px 70px rgba(8, 18, 34, 0.12)",
        glow: "0 18px 42px rgba(70, 110, 255, 0.2)"
      },
      backgroundImage: {
        "stadium-grid":
          "radial-gradient(circle at top, rgba(70,110,255,0.18), transparent 36%), linear-gradient(135deg, rgba(255,255,255,0.04) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.04) 25%, transparent 25%)"
      }
    }
  },
  plugins: []
};

export default config;
