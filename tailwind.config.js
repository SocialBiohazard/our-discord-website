/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        text: {
          primary: "#00ffff",
          secondary: "#ffffff",
        },
        neon: {
          pink: "#ff00ff",
          cyan: "#00ffff",
          yellow: "#ffff00",
          blue: "#0080ff",
          green: "#00ff00",
        },
        overlay: "rgba(0,0,0,0.8)",
        vhs: {
          red: "#ff0040",
          scan: "rgba(0,255,0,0.1)",
        },
      },
      fontFamily: {
        arcade: ["'Press Start 2P'", "cursive"],
        orbitron: ["Orbitron", "sans-serif"],
        terminal: ["VT323", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,255,255,0.5)",
        pink: "0 0 20px rgba(255,0,255,0.5)",
      },
      keyframes: {
        glow: {
          "0%": { textShadow: "0 0 5px #ff00ff" },
          "100%": { textShadow: "0 0 20px #ff00ff, 0 0 40px #00ffff" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        bounce: "bounce 2s infinite",
      },
    },
  },
  plugins: [],
}

