import React, { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  playtime?: string;
  achievements?: number;
  uuid?: string;
  avatar?: string;
}

interface LeaderboardProps {
  serverAddress: string;
}

export default function Leaderboard({ serverAddress }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // Get current players from the server instead of placeholder data
        const response = await fetch(`/api/minecraft/players?server=${encodeURIComponent(serverAddress)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch current players');
        }
        
        const data = await response.json();
        const currentPlayers = data.players || [];
        
        // Convert current players to leaderboard format
        const playerEntries: LeaderboardEntry[] = currentPlayers.map((player: any, index: number) => ({
          rank: index + 1,
          name: player.name,
          uuid: player.uuid,
          avatar: player.avatar,
          playtime: "Currently Online",
          achievements: undefined
        }));
        
        setEntries(playerEntries);
        setError(currentPlayers.length > 0 ? null : "No players currently online to display");
      } catch (err) {
        setEntries([]);
        setError("Unable to fetch player data - server may be offline");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Refresh every 30 seconds to match player list
    const interval = setInterval(fetchLeaderboard, 30000);
    
    return () => clearInterval(interval);
  }, [serverAddress]);

  const getPlayerInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-300";
      case 3:
        return "text-orange-400";
      default:
        return "text-purple-400";
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Server Leaderboard</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h3 className="text-lg font-orbitron font-semibold text-white mb-4 underline shining-text">
        Current Players
      </h3>
      
      {error && (
        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 mb-4">
          <p className="text-blue-400 text-sm">ℹ️ {error}</p>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <p className="text-gray-400">No leaderboard data available</p>
          <p className="text-sm text-gray-500 mt-1">Start playing to see your stats here!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.rank} className="flex items-center space-x-4 bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-colors">
              {/* Rank */}
              <div className="flex-shrink-0 w-12 text-center">
                <span className={`text-lg font-bold ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </span>
              </div>

              {/* Player Avatar */}
              <div className="flex-shrink-0">
                {entry.avatar ? (
                  <img
                    src={entry.avatar}
                    alt={`${entry.name}'s avatar`}
                    className="w-10 h-10 rounded-lg border border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white text-sm font-bold ${entry.avatar ? 'hidden' : 'flex'}`}
                >
                  {getPlayerInitials(entry.name)}
                </div>
              </div>

              {/* Player Name */}
              <div className="flex-1">
                <h4 className="text-white font-semibold">{entry.name}</h4>
              </div>

              {/* Stats */}
              <div className="flex-shrink-0 text-right">
                {entry.playtime && (
                  <div className="text-purple-400 text-sm font-medium">
                    {entry.playtime}
                  </div>
                )}
                {entry.achievements && (
                  <div className="text-gray-400 text-xs">
                    {entry.achievements} achievements
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm text-center">
          Currently online players • Updates every 30 seconds
        </p>
      </div>
    </div>
  );
}
