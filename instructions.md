
# Holy Trinity Portal — Implementation Spec (Cursor -> Vercel)

Notes:
- Target: build the whole site inside Cursor (dev) and deploy to Vercel.
- Framework: Next.js (TypeScript) + Tailwind CSS. No database.
- Pages: / (Holy Trinity), /minecraft, /hall-of-fame
- Distinguish steps: "Agent steps" = what the Cursor agent should implement. "You / Admin steps" = things you must do (create tokens, install plugins, upload files, invite bots, etc).
- Serverless functions (Next.js API routes) are allowed and will be used to proxy secreted API calls (Discord, Medal) — these run on Vercel.
- THE DESIGN SCHEME IS AVAILABLE IN design_scheme.md PLEASE REFER TO THIS DESIGN SCHEME BEFORE DESIGNING OR STYLING ANYTHING
---

## Prerequisites (things you or the Cursor agent must have)
1. GitHub repo created for the project (Cursor will push code here). (IGNORE THIS FOR NOW, ADMIN WILL DECIDE LATER)
2. Vercel account for deployment; ability to set environment variables.
3. Discord account with owner/admin access to the three servers and permission to create a bot.
4. Exaroton server control panel access (or whichever Minecraft host you choose).
5. Medal.tv account for the team (optional: API key if automating).

---

# 1) Holy Trinity (Discord page)
Files to create (example):
- pages/index.tsx            (Home / Holy Trinity page)
- components/DiscordWidget.tsx
- components/DiscordEvents.tsx
- components/AnnouncementsMirror.tsx
- pages/api/discord/events.ts
- pages/api/discord/announcements.ts
- utils/discord.ts

Agent steps (implement in Cursor)
1. Initialize Next.js + TypeScript + Tailwind boilerplate in repo.
2. Create pages/index.tsx containing layout and three sections: intro, Discord widget area, events and announcements area.
3. Implement components/DiscordWidget.tsx:
   - Render an iframe placeholder for Discord widget.
   - Accept props: serverId, width, height, theme.
   - Example iframe:
     ```jsx
     <iframe
       src={`https://discord.com/widget?id=${serverId}&theme=dark`}
       width={width}
       height={height}
       allowTransparency
       frameBorder="0"
       sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
     />
     ```
4. Implement pages/api/discord/events.ts as a Vercel serverless route:
   - Read DISCORD_BOT_TOKEN and DISCORD_GUILD_ID from process.env.
   - Call Discord API: GET https://discord.com/api/v10/guilds/{GUILD_ID}/scheduled-events
   - Return a compact JSON with event id, name, start_time, description, url.
   - Handle errors, rate limits, and cache result for 30-60 seconds.
   - Example pseudo-code:
     ```ts
     export default async function handler(req, res) {
       const token = process.env.DISCORD_BOT_TOKEN;
       const guild = process.env.DISCORD_GUILD_ID;
       const r = await fetch(`https://discord.com/api/v10/guilds/${guild}/scheduled-events`, {
         headers: { Authorization: `Bot ${token}` }
       });
       const events = await r.json();
       res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=60');
       res.json(events);
     }
     ```
5. Implement components/DiscordEvents.tsx:
   - Fetch `/api/discord/events` client-side or use SWR.
   - Render a small timeline card with event name, time (convert to user's locale), and RSVP button linking to Discord event URL.
6. Implement pages/api/discord/announcements.ts:
   - Read DISCORD_BOT_TOKEN and ANNOUNCEMENTS_CHANNEL_ID from process.env.
   - Call GET https://discord.com/api/v10/channels/{channel.id}/messages?limit=10
   - Filter messages for pinned or messages by server staff as desired.
   - Cache results (short TTL).
7. Implement components/AnnouncementsMirror.tsx:
   - Fetch `/api/discord/announcements` and render the latest N messages (author avatar, content, timestamp).
   - Sanitize message content (strip dangerous HTML) and render basic markdown-style formatting.
8. Styling: make all Discord components fit the neon/dark theme using Tailwind utility classes and reusable CSS variables for neon colors.
9. Add .env.example with DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, ANNOUNCEMENTS_CHANNEL_ID.

You / Admin steps (must do)
1. Create a Discord application and bot:
   - Go to Discord Developer Portal → New Application → Bot → Add Bot.
   - Copy Bot Token (store securely).
2. Invite bot to the three servers with at least read message + read message history permissions and "View Channel" for announcements channel. If reading scheduled events requires special permissions, grant Manage Events or application scope as needed.
3. Enable Gateway Intents if required for your bot (for reading message content you may need MESSAGE_CONTENT intent — check Discord docs).
4. Set environment variables in Vercel:
   - DISCORD_BOT_TOKEN = <bot token>
   - DISCORD_GUILD_ID = <primary guild id>
   - ANNOUNCEMENTS_CHANNEL_ID = <channel id for announcements>
5. Obtain server IDs and channel IDs: Right click on server/channel in Discord with Developer Mode enabled → copy ID.
6. Test the serverless endpoints locally (using Vercel dev or next dev) and verify they return expected JSON.

Notes:
- Keep tokens out of the repo. Never commit secrets.
- Use API caching headers to avoid hitting Discord rate limits.

---

# 2) Minecraft page
Files to create:
- pages/minecraft.tsx
- components/MinecraftStatus.tsx
- components/PlayerList.tsx
- components/MapEmbed.tsx
- components/Leaderboard.tsx
- pages/api/minecraft/status.ts  (optional proxy)
- pages/api/minecraft/players.ts (optional proxy)
- pages/api/minecraft/leaderboard.ts (fetch static JSON or Plan proxy)

Agent steps
1. Create page pages/minecraft.tsx with layout: top row status + MOTD + player list cards, below that Map embed card, below that Leaderboard card.
2. Implement MapEmbed.tsx:
   - Accept mapUrl prop.
   - Render `<iframe src={mapUrl} className="w-full h-[600px]" />`
3. Implement MinecraftStatus.tsx:
   - Option A (client-only): fetch `https://api.mcsrvstat.us/2/{SERVER_IP_OR_HOST}` from the browser and render online/offline, players.online, motd.clean[], version.
   - Option B (serverless proxy): create pages/api/minecraft/status.ts that proxies the same API (useful if CORS).
   - Display status in neon HUD card.
   - Use s-maxage caching headers (30s-60s).
4. Implement PlayerList.tsx:
   - Fetch the same status API to get `players.list`.
   - For each player name, try to get UUID using Mojang API:
     `GET https://api.mojang.com/users/profiles/minecraft/{username}`
   - If UUID obtained, render avatar via Crafatar: `https://crafatar.com/avatars/{uuid}?size=64`
   - Fallback: show initials / username in neon pill.
   - Use batching or a cached lookup (serverless route recommended) to avoid Mojang rate limits.
5. Implement Leaderboard.tsx:
   - Use one of two approaches:
     - If Plan plugin or other analytics plugin can export a JSON file: fetch that JSON and render top players (playtime, kills, achievements).
     - If not available, render static "Hall of Fame" entries from a repo JSON (`/public/leaderboard.json`) that you update manually.
6. Create pages/api/minecraft/leaderboard.ts (optional):
   - If Plan provides a remote JSON endpoint, implement a proxy to fetch it and cache.

You / Admin steps
1. On Exaroton (or host):
   - Stop server.
   - Install map plugin:
     - For Spigot/Paper: use Dynmap plugin (put dynmap.jar in plugins folder).
     - For modded servers or Fabric/Forge: use BlueMap (BlueMap requires setup).
   - Start server and run plugin setup commands (see plugin docs).
2. Configure plugin webserver and obtain public map URL:
   - Dynmap and BlueMap generate a web UI; on Exaroton, map is usually available at a subpath or via a provided URL. Copy that link.
3. Get your server IP/port (Exaroton panel provides IP and server address).
4. Install Plan or another stats plugin if you want automatic leaderboards:
   - Install plugin jar, configure export or API and test export to a public URL or to a file that you can retrieve.
   - If Plan provides a web API, copy its endpoint or export file path.
5. (Optional) If fetching player UUIDs from Mojang, be aware of rate limits; consider configuring a cached lookup:
   - Either maintain a `public/uuids.json` manual mapping, or let the serverless function cache results in-memory/edge cache.
6. Provide the mapUrl and server address to the Cursor agent via repo config file or environment variables.

Notes:
- Dynmap and BlueMap configuration differs; read plugin docs in the server control panel.
- If the map uses a non-standard port, ensure Exaroton exposes it or provides a proxied URL.

---

# 3) Hall of Fame (MedalTV integration)
Files to create:
- pages/hall-of-fame.tsx
- components/ClipGrid.tsx
- pages/api/medal/recent.ts
- public/clips-manual.json  (fallback manual clip list)
- .env.example: MEDAL_API_KEY, MEDAL_USER_ID (if automated)

Agent steps
1. Create the /hall-of-fame page with a responsive grid component ClipGrid.
2. Implement ClipGrid to support two modes:
   - Manual mode: load `public/clips-manual.json` (array of {id, title, embedUrl, thumbnail}) and render iframes or HTML5 `<video>` where possible.
   - Automated mode: fetch `/api/medal/recent` and render returned clips using Medal embed iframes:
     Example embed:
     `<iframe width="640" height="360" src="https://medal.tv/clip/{CLIP_ID}" frameborder="0" allow="autoplay" allowfullscreen></iframe>`
3. Implement pages/api/medal/recent.ts (serverless):
   - Read MEDAL_API_KEY and MEDAL_USER_ID from env.
   - Call Medal REST API endpoints to list recent clips for the user or group.
   - Map the response to `{ id, title, embedUrl, thumbnail, created_at }`.
   - Cache results (s-maxage 60s).
4. Provide an admin UI (optional) or a JSON file for manual adds/removals.
5. For clip playback: use Medal embed iframe. For autoplay/controls, follow Medal embed docs.

You / Admin steps
1. Decide Manual vs Automated workflow:
   - Manual (recommended if small team): Upload clips to Medal, open clip page, copy embed URL, paste into `public/clips-manual.json`. Cursor agent will render them.
   - Automated: Request a Medal API key (Medal Developer docs) and provide MEDAL_API_KEY + MEDAL_USER_ID to Cursor via Vercel env vars.
2. To automate uploads from Discord (advanced, optional):
   - Create a Discord bot that listens to a designated #clips channel for attachments.
   - When a file/attachment appears, the bot downloads the file and then attempts to upload to Medal via the Medal REST API (if their API supports server-side uploads). If Medal does not provide server-side upload endpoints, you will need a machine or server running a syncing client or manual import.
   - Note: Medal’s docs show a REST API and Game API; verify upload capability and TOS before automating. See Medal docs for API keys and embed rules.
3. If using automated Medal fetch: generate an API key on Medal (Developer area) and set:
   - MEDAL_API_KEY in Vercel
   - MEDAL_USER_ID (the medal account or group id)
4. If manual: maintain `public/clips-manual.json` with new entries whenever clips are uploaded.

Notes:
- Medal supports embeds (iframe) for individual clips. Use embed iframe to play on site.
- Medal offers REST/game APIs — use API key and follow their docs for endpoints and rate limits.

Caveats and recommendations:
- For automation from Discord -> Medal, check whether Medal allows server-side uploads. If not available, prefer manual upload or a local machine that syncs to Medal (Medal app auto-upload feature).
- Keep a fallback manual JSON so the Hall of Fame never breaks.

References:
- Medal API and embed docs: see Medal developer docs (use your API key). (Developer docs and embed examples will be used by the agent)
- Use embed iframe pattern: https://medal.tv/clip/{clipId}

---

# Global tasks (Vercel / Environment)
Agent steps
1. Add .env.example and instructions in README for the following variables:
   - DISCORD_BOT_TOKEN
   - DISCORD_GUILD_ID
   - ANNOUNCEMENTS_CHANNEL_ID
   - MEDAL_API_KEY (if automating)
   - MEDAL_USER_ID (if automating)
   - MINECRAFT_SERVER_HOST (ip or hostname)
2. Use Next.js API routes under pages/api for all calls requiring secrets.
3. Set caching headers on API responses: `s-maxage` and `stale-while-revalidate`.
4. Implement lightweight error handling and fallbacks (show "offline" card if API fails).
5. Add a CI step or README instructing Cursor to run `npm run build` and `npm run start` with Node 18+.

You / Admin steps
1. In Vercel dashboard, set each environment variable listed above.
2. Ensure Vercel project is linked to GitHub repo and automatic deploys are enabled.
3. For Discord bot token rotation or revocation, update env var and redeploy.

---

# Cursor rules and developer guidelines
1. Use Next.js + TypeScript + Tailwind CSS.
2. Keep components atomic and documented; create a `components/README.md`.
3. Do not commit secrets. Add `.env` to .gitignore and include `.env.example`.
4. API routes that use third-party tokens must be under `pages/api/*` and must return only necessary fields.
5. All endpoints must set cache headers and handle 429 (rate limit) gracefully.
6. Use client-side fetching (SWR) for UI live updates with polling or webhooks where possible.
7. Keep dependency list minimal. Avoid heavy libs for tiny tasks (e.g., avoid full server frameworks).
8. Provide a `README.md` with local dev steps, environment variables, and Exaroton plugin instructions.
9. When uncertain about external API behavior (Medal uploads, Exaroton map URL patterns), create a TODO comment and a short README entry instructing the admin how to fill the missing data.
10. When adding Mojang username->UUID lookups, implement caching logic (memory or edge) and respect rate limits.
11. Create a "Manual override" admin JSON for clips/leaderboard to allow quick edits without re-deploy.

---

# Final checklist (to pass to Cursor agent)
1. Scaffold project (Next.js TS + Tailwind).
2. Create the three pages and components listed.
3. Implement API routes for Discord events and announcements.
4. Implement Minecraft status/player list + map embed + optional leaderboard proxy.
5. Implement Hall of Fame with manual JSON fallback and optional Medal API route.
6. Add tests or sanity checks for each API route.
7. Add README and .env.example.
8. Prepare PR with instructions for admin steps (bot creation, Exaroton plugin install, Vercel env).

