import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Instrument Serif'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        sage: {
          50: "#f5f7f4",
          100: "#e8ede6",
          200: "#d1dccf",
          300: "#adc0a8",
          400: "#83a07d",
          500: "#62825c",
          600: "#4c6847",
          700: "#3d5339",
          800: "#334430",
          900: "#2b3829",
        },
        cream: {
          50: "#fdfcf8",
          100: "#f9f6ed",
          200: "#f2ead7",
          300: "#e8d9b9",
          400: "#d9c08a",
          500: "#cba862",
        },
        charcoal: {
          800: "#1a1f1a",
          900: "#111411",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "pulse-gentle": "pulseGentle 2s ease-in-out infinite",
        "streak-glow": "streakGlow 1.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        streakGlow: {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(98, 130, 92, 0.4)" },
          "50%": { transform: "scale(1.05)", boxShadow: "0 0 0 8px rgba(98, 130, 92, 0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(98, 130, 92, 0)" },
        },
      },
      boxShadow: {
        "card": "0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.10), 0 0 1px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
