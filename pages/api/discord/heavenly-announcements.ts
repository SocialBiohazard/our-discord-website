import type { NextApiRequest, NextApiResponse } from 'next';

interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
  };
  timestamp: string;
  edited_timestamp?: string | null;
  attachments: any[];
  embeds: any[];
  pinned: boolean;
}

// Cache for announcements
let cachedAnnouncements: DiscordMessage[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check cache first
    const now = Date.now();
    if (cachedAnnouncements && (now - cacheTimestamp) < CACHE_DURATION) {
      return res.json(cachedAnnouncements);
    }

    const token = process.env.DISCORD_BOT_TOKEN;
    const channelId = '1303427141341544539'; // Heavenly Domain announcements channel
    const guildId = '1303423213790822521'; // Heavenly Domain guild ID

    if (!token) {
      return res.status(500).json({ error: 'Discord bot token not configured' });
    }

    // Fetch messages
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=10`,
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
        error: 'Failed to fetch messages from Discord',
        details: errorData 
      });
    }

    const messages: DiscordMessage[] = await response.json();

    // Fetch guild channels and roles for mention parsing
    let channels: { [id: string]: string } = {};
    let roles: { [id: string]: string } = {};

    try {
      // Fetch channels
      const channelsResponse = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/channels`,
        {
          headers: {
            'Authorization': `Bot ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        channels = channelsData.reduce((acc: any, channel: any) => {
          acc[channel.id] = channel.name;
          return acc;
        }, {});
      }

      // Fetch roles
      const rolesResponse = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/roles`,
        {
          headers: {
            'Authorization': `Bot ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        roles = rolesData.reduce((acc: any, role: any) => {
          acc[role.id] = role.name;
          return acc;
        }, {});
      }
    } catch (guildError) {
      console.warn('Failed to fetch guild data for mentions:', guildError);
    }
    
    // Filter messages to show those with content
    const filteredMessages = messages.filter(msg => 
      msg.content && msg.content.trim().length > 0
    ).slice(0, 5); // Limit to 5 recent messages

    // Response with mention data
    const responseData = {
      messages: filteredMessages,
      mentions: {
        channels,
        roles
      }
    };

    // Update cache
    cachedAnnouncements = filteredMessages;
    cacheTimestamp = now;

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    
    return res.json(responseData);
  } catch (error) {
    console.error('Error fetching Heavenly Domain announcements:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
