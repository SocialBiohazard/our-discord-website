import type { NextApiRequest, NextApiResponse } from 'next';

interface ServerStatusResponse {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  motd: {
    clean: string[];
  };
  version: string;
  hostname: string;
  port: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerStatusResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { server } = req.query;

  if (!server || typeof server !== 'string') {
    return res.status(400).json({ error: 'Server address is required' });
  }

  try {
    // Use mcsrvstat.us API to get server status
    const response = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(server)}`, {
      headers: {
        'User-Agent': 'Holy-Trinity-Portal/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to match our interface
    const statusData: ServerStatusResponse = {
      online: data.online || false,
      players: {
        online: data.players?.online || 0,
        max: data.players?.max || 0
      },
      motd: {
        clean: data.motd?.clean || []
      },
      version: data.version || 'Unknown',
      hostname: data.hostname || server,
      port: data.port || 25565
    };

    // Cache for 30 seconds
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(statusData);

  } catch (error) {
    console.error('Error fetching server status:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch server status' 
    });
  }
}
