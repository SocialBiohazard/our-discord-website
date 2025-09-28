// tailwind.config.js
module.exports = {
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
};

// Reusable components
export function NeonButton({ children, href }: { children: React.ReactNode, href?: string }) {
  return (
    <a
      href={href || "#"}
      className="px-6 py-3 border-2 border-neon-cyan text-neon-cyan font-terminal text-lg
                 transition-all duration-300 relative inline-block hover:bg-neon-cyan hover:text-primary
                 hover:shadow-neon hover:-translate-y-0.5"
    >
      {children}
    </a>
  );
}
export function NeonCard({ title, icon, description }: { title: string, icon: string, description: string }) {
  return (
    <div className="bg-black/70 border-2 border-neon-pink rounded-lg p-6 text-center transition-all duration-300 hover:border-neon-cyan hover:shadow-neon">
      <span className="text-3xl block mb-2">{icon}</span>
      <h3 className="font-bold text-xl text-text-secondary">{title}</h3>
      <p className="text-text-secondary mt-2">{description}</p>
    </div>
  );
}