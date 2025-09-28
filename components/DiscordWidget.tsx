import React from 'react';

interface DiscordWidgetProps {
  serverId: string;
  width?: string | number;
  height?: string | number;
  theme?: 'dark' | 'light';
}

export default function DiscordWidget({ 
  serverId = "1390814481872851015", // Default to your server ID
  width = "100%", 
  height = "500", 
  theme = "dark" 
}: DiscordWidgetProps) {
  // Use the provided serverId, fallback to environment variable, then to default
  const guildId = serverId || process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "1390814481872851015";

  return (
    <div className="relative bg-gray-900/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-600">
        <h3 className="text-sm font-orbitron font-semibold text-white">Live Server</h3>
      </div>
      
      {/* Discord Widget */}
      <div className="p-2">
        <iframe
          src={`https://discord.com/widget?id=${guildId}&theme=${theme}`}
          width="100%"
          height={height}
          allowTransparency
          style={{ border: 0 }}
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          className="w-full rounded border border-gray-700/50 bg-gray-900"
          loading="lazy"
          title="Discord Server Widget"
        />
      </div>
      
      {/* Footer */}
      <div className="bg-gray-800/80 px-4 py-2 border-t border-gray-600">
        <a 
          href={`https://discord.gg/invite-link`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-orbitron"
        >
          Join Server →
        </a>
      </div>
    </div>
  );
}
