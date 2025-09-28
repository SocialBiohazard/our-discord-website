# Holy Trinity Portal

A Next.js web portal integrating Discord, Minecraft server status, and Medal.tv Hall of Fame with a neon/cyberpunk theme.

## Features

- **Discord Integration**: Live server widget, events, and announcements
- **Minecraft Server Status**: Real-time player count and server info
- **Hall of Fame**: Medal.tv clips and highlights
- **Neon/Cyberpunk Theme**: Custom styling with glowing effects

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Discord bot with proper permissions
- Minecraft server (for status features)
- Medal.tv account (optional, for automated clips)

## Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   - `DISCORD_BOT_TOKEN`: Your Discord bot token
   - `DISCORD_GUILD_ID`: Your Discord server ID
   - `ANNOUNCEMENTS_CHANNEL_ID`: Channel ID for announcements
   - `NEXT_PUBLIC_DISCORD_GUILD_ID`: Same as DISCORD_GUILD_ID (for client-side widget)
   - `MINECRAFT_SERVER_HOST`: Your Minecraft server IP/hostname
   - `MEDAL_API_KEY` & `MEDAL_USER_ID`: For automated Medal.tv integration (optional)

3. **Development**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application → Bot → Add Bot
3. Copy Bot Token to `DISCORD_BOT_TOKEN`
4. Invite bot to your servers with permissions:
   - Read Messages
   - Read Message History
   - View Channels
   - Manage Events (for reading scheduled events)

## Minecraft Server Setup (Optional)

For Minecraft features, install these plugins on your server:

1. **Map Plugin** (choose one):
   - **Dynmap**: For Spigot/Paper servers
   - **BlueMap**: For modded/Fabric/Forge servers

2. **Stats Plugin** (optional):
   - **Plan**: For detailed analytics and leaderboards

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

Standard Next.js deployment applies to any platform supporting Node.js.

## Project Structure

```
├── pages/
│   ├── index.tsx              # Holy Trinity Discord page
│   ├── minecraft.tsx          # Minecraft server page
│   ├── hall-of-fame.tsx       # Medal.tv clips page
│   └── api/                   # Serverless API routes
├── components/                # Reusable React components
├── styles/                    # Global styles and Tailwind
├── utils/                     # Utility functions
└── public/                    # Static assets
```

## API Routes

- `/api/discord/events` - Fetch Discord scheduled events
- `/api/discord/announcements` - Fetch channel announcements
- `/api/minecraft/status` - Minecraft server status
- `/api/medal/recent` - Recent Medal.tv clips

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize the neon color scheme:

```js
colors: {
  neon: {
    pink: "#ff00ff",
    cyan: "#00ffff", 
    yellow: "#ffff00",
    // ... more colors
  }
}
```

### Fonts

The project uses three font families:
- **Orbitron**: Main UI font
- **Press Start 2P**: Retro arcade headings  
- **VT323**: Terminal/monospace text

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_BOT_TOKEN` | Discord bot token | Yes |
| `DISCORD_GUILD_ID` | Primary Discord server ID | Yes |
| `ANNOUNCEMENTS_CHANNEL_ID` | Announcements channel ID | Yes |
| `NEXT_PUBLIC_DISCORD_GUILD_ID` | Public guild ID for widget | Yes |
| `MINECRAFT_SERVER_HOST` | Minecraft server IP/hostname | No |
| `MEDAL_API_KEY` | Medal.tv API key | No |
| `MEDAL_USER_ID` | Medal.tv user ID | No |

## Troubleshooting

### Discord Widget Not Loading
- Check `NEXT_PUBLIC_DISCORD_GUILD_ID` is set correctly
- Ensure Discord server has widget enabled in server settings

### API Routes Failing  
- Verify all environment variables are set
- Check bot permissions in Discord servers
- Review Vercel/deployment logs for errors

### Minecraft Status Not Working
- Verify `MINECRAFT_SERVER_HOST` format (IP:PORT or hostname)
- Ensure server is online and accessible
- Check if server blocks status queries

## License

ISC
