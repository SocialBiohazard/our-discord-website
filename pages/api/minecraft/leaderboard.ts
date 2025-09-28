import type { NextApiRequest, NextApiResponse } from 'next';

interface LeaderboardEntry {
  rank: number;
  name: string;
  playtime?: string;
  achievements?: number;
  uuid?: string;
  avatar?: string;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { server } = req.query;

  if (!server || typeof server !== 'string') {
    return res.status(400).json({ error: 'Server address is required' });
  }

  try {
    // TODO: In the future, this could connect to Plan plugin or other stats APIs
    // For now, we'll return placeholder data to show the structure
    
    // This is where you would fetch from Plan plugin API:
    // const response = await fetch(`${planApiUrl}/players/top`);
    // const data = await response.json();
    
    // Placeholder leaderboard data
    const placeholderEntries: LeaderboardEntry[] = [
      { 
        rank: 1, 
        name: "ServerChampion", 
        playtime: "156h 23m", 
        achievements: 89,
        uuid: "069a79f4-44e9-4726-a5be-fca90e38aaf5",
        avatar: "https://crafatar.com/avatars/069a79f4-44e9-4726-a5be-fca90e38aaf5?size=64"
      },
      { 
        rank: 2, 
        name: "BuildMaster", 
        playtime: "142h 15m", 
        achievements: 76,
        uuid: "61699b2e-d327-4a01-9f1e-0ea8c3f06bc6",
        avatar: "https://crafatar.com/avatars/61699b2e-d327-4a01-9f1e-0ea8c3f06bc6?size=64"
      },
      { 
        rank: 3, 
        name: "Explorer_Pro", 
        playtime: "138h 47m", 
        achievements: 71,
        uuid: "853c80ef-3c37-49fd-aa49-938b674adae6",
        avatar: "https://crafatar.com/avatars/853c80ef-3c37-49fd-aa49-938b674adae6?size=64"
      },
      { 
        rank: 4, 
        name: "RedstoneWiz", 
        playtime: "129h 33m", 
        achievements: 68
      },
      { 
        rank: 5, 
        name: "CraftingKing", 
        playtime: "115h 52m", 
        achievements: 62
      }
    ];

    const result: LeaderboardResponse = {
      entries: placeholderEntries
    };

    // Cache for 5 minutes (leaderboard changes less frequently)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch leaderboard' 
    });
  }
}
