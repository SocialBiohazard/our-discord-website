import React, { useState, useEffect } from 'react';

interface Player {
  name: string;
  uuid?: string;
  avatar?: string;
}

interface PlayerListProps {
  serverAddress: string;
}

export default function PlayerList({ serverAddress }: PlayerListProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/minecraft/players?server=${encodeURIComponent(serverAddress)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch player list');
        }
        
        const data = await response.json();
        setPlayers(data.players || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPlayers, 30000);
    
    return () => clearInterval(interval);
  }, [serverAddress]);

  const getPlayerInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Online Players</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Online Players</h3>
        <div className="text-red-400 text-center py-4">
          <p>❌ Unable to fetch player list</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h3 className="text-lg font-orbitron font-semibold text-white mb-4 underline shining-text">
        Online Players
      </h3>
      
      {players.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <p className="text-gray-400">No players currently online</p>
          <p className="text-sm text-gray-500 mt-1">Come join the adventure!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Currently Online:</span>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {players.length}
            </span>
          </div>
          
          <div className="grid gap-2">
            {players.map((player, index) => (
              <div key={index} className="flex items-center space-x-3 bg-gray-900/50 rounded-lg p-3 hover:bg-gray-900/70 transition-colors">
                {/* Player Avatar */}
                <div className="flex-shrink-0">
                  {player.avatar ? (
                    <img
                      src={player.avatar}
                      alt={`${player.name}'s avatar`}
                      className="w-8 h-8 rounded-lg border border-gray-600"
                      onError={(e) => {
                        // Fallback to initials if avatar fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs font-bold ${player.avatar ? 'hidden' : 'flex'}`}
                  >
                    {getPlayerInitials(player.name)}
                  </div>
                </div>
                
                {/* Player Name */}
                <div className="flex-1">
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                
                {/* Online Indicator */}
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
