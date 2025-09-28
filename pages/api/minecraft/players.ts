import type { NextApiRequest, NextApiResponse } from 'next';

interface Player {
  name: string;
  uuid?: string;
  avatar?: string;
}

interface PlayersResponse {
  players: Player[];
  count: number;
}

// Simple in-memory cache for UUIDs (in production, consider using Redis or a database)
const uuidCache = new Map<string, { uuid: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getPlayerUUID(username: string): Promise<string | null> {
  // Check cache first
  const cached = uuidCache.get(username.toLowerCase());
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.uuid;
  }

  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Holy-Trinity-Portal/1.0'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const uuid = data.id;
      
      // Cache the result
      uuidCache.set(username.toLowerCase(), {
        uuid,
        timestamp: Date.now()
      });
      
      return uuid;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching UUID for ${username}:`, error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlayersResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { server } = req.query;

  if (!server || typeof server !== 'string') {
    return res.status(400).json({ error: 'Server address is required' });
  }

  try {
    // Get server status which includes player list
    const response = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(server)}`, {
      headers: {
        'User-Agent': 'Holy-Trinity-Portal/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.online) {
      return res.status(200).json({ players: [], count: 0 });
    }

    const playerNames = data.players?.list || [];
    const players: Player[] = [];

    // Process each player (limit to avoid rate limits)
    const maxPlayers = Math.min(playerNames.length, 20); // Limit to 20 players to avoid API rate limits
    
    for (let i = 0; i < maxPlayers; i++) {
      const name = playerNames[i];
      const player: Player = { name };

      // Try to get UUID and avatar (with a small delay to avoid rate limiting)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between requests
      }
      
      const uuid = await getPlayerUUID(name);
      if (uuid) {
        player.uuid = uuid;
        player.avatar = `https://crafatar.com/avatars/${uuid}?size=64&default=MHF_Steve`;
      }

      players.push(player);
    }

    const result: PlayersResponse = {
      players,
      count: players.length
    };

    // Cache for 30 seconds
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching player list:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch player list' 
    });
  }
}
