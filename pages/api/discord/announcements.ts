import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.ANNOUNCEMENTS_CHANNEL_ID;

  if (!token || !channelId) {
    return res.status(500).json({ 
      error: 'Discord configuration missing',
      details: 'DISCORD_BOT_TOKEN and ANNOUNCEMENTS_CHANNEL_ID must be set'
    });
  }

  try {
    const guildId = process.env.DISCORD_GUILD_ID;
    
    // Fetch messages
    const messagesResponse = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=10`,
      {
        headers: {
          'Authorization': `Bot ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!messagesResponse.ok) {
      if (messagesResponse.status === 401) {
        return res.status(401).json({ error: 'Invalid Discord bot token' });
      }
      if (messagesResponse.status === 403) {
        return res.status(403).json({ error: 'Bot lacks permission to read messages' });
      }
      if (messagesResponse.status === 404) {
        return res.status(404).json({ error: 'Channel not found or bot lacks access' });
      }
      throw new Error(`Discord API error: ${messagesResponse.status}`);
    }

    const messages = await messagesResponse.json();

    // Fetch guild channels and roles for mention parsing
    let channels: { [id: string]: string } = {};
    let roles: { [id: string]: string } = {};

    if (guildId) {
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
    }

    // Filter and format messages
    const announcements = messages
      .filter((msg: any) => 
        // Show all messages for now (you can add filters later)
        msg.content && msg.content.trim().length > 0 // Only messages with content
      )
      .map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        author: {
          id: msg.author.id,
          username: msg.author.username,
          avatar: msg.author.avatar,
          discriminator: msg.author.discriminator
        },
        timestamp: msg.timestamp,
        pinned: msg.pinned
      }))
      .slice(0, 5); // Limit to 5 most recent

    // Include mention data for parsing
    const responseData = {
      messages: announcements,
      mentions: {
        channels,
        roles
      }
    };

    // Cache for 30 seconds  
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Discord announcements API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Discord announcements',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
