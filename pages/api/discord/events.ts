import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !guildId) {
    return res.status(500).json({ 
      error: 'Discord configuration missing',
      details: 'DISCORD_BOT_TOKEN and DISCORD_GUILD_ID must be set'
    });
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/scheduled-events`,
      {
        headers: {
          'Authorization': `Bot ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid Discord bot token' });
      }
      if (response.status === 403) {
        return res.status(403).json({ error: 'Bot lacks permission to read events' });
      }
      if (response.status === 404) {
        return res.status(404).json({ error: 'Guild not found or bot not in guild' });
      }
      throw new Error(`Discord API error: ${response.status}`);
    }

    const events = await response.json();

    // Filter for upcoming events and sort by start time
    const upcomingEvents = events
      .filter((event: any) => new Date(event.scheduled_start_time) > new Date())
      .sort((a: any, b: any) => 
        new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime()
      )
      .map((event: any) => ({
        id: event.id,
        name: event.name,
        description: event.description,
        scheduled_start_time: event.scheduled_start_time,
        scheduled_end_time: event.scheduled_end_time,
        entity_metadata: event.entity_metadata
      }));

    // Cache for 60 seconds
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json(upcomingEvents);

  } catch (error) {
    console.error('Discord events API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Discord events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
