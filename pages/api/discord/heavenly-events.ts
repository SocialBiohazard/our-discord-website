import type { NextApiRequest, NextApiResponse } from 'next';

interface DiscordEvent {
  id: string;
  name: string;
  description: string | null;
  scheduled_start_time: string;
  scheduled_end_time: string | null;
  entity_metadata: any;
  user_count: number | null;
  image: string | null;
}

// Cache for events
let cachedEvents: DiscordEvent[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 60 seconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check cache first
    const now = Date.now();
    if (cachedEvents && (now - cacheTimestamp) < CACHE_DURATION) {
      return res.json(cachedEvents);
    }

    const token = process.env.DISCORD_BOT_TOKEN;
    const guildId = '1303423213790822521'; // Heavenly Domain guild ID

    if (!token) {
      return res.status(500).json({ error: 'Discord bot token not configured' });
    }

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/scheduled-events`,
      {
        headers: {
          'Authorization': `Bot ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Discord API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'Failed to fetch events from Discord',
        details: errorData 
      });
    }

    const events: DiscordEvent[] = await response.json();
    
    // Filter and sort events (upcoming events first)
    const now_iso = new Date().toISOString();
    const filteredEvents = events
      .filter(event => event.scheduled_start_time > now_iso) // Only future events
      .sort((a, b) => new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime())
      .slice(0, 5); // Limit to 5 upcoming events

    // Update cache
    cachedEvents = filteredEvents;
    cacheTimestamp = now;

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    
    return res.json(filteredEvents);
  } catch (error) {
    console.error('Error fetching Heavenly Domain events:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

