import React, { useState, useEffect } from 'react';

interface ServerStatus {
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

interface MinecraftStatusProps {
  serverAddress: string;
}

export default function MinecraftStatus({ serverAddress }: MinecraftStatusProps) {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/minecraft/status?server=${encodeURIComponent(serverAddress)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch server status');
        }
        
        const data = await response.json();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, [serverAddress]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Server Status</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Server Status</h3>
        <div className="text-red-400 text-center py-4">
          <p>❌ Unable to fetch server status</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h3 className="text-lg font-orbitron font-semibold text-white mb-4 underline shining-text">
        Server Status
      </h3>
      
      <div className="space-y-4">
        {/* Online Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Status:</span>
          <div className="flex items-center space-x-2">
            {(() => {
              if (!status?.online) {
                return (
                  <>
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="font-semibold text-red-400">Offline</span>
                  </>
                );
              } else if (status.version?.includes('Sleeping') || status.players.online === 0) {
                return (
                  <>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="font-semibold text-yellow-400">Sleeping</span>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="font-semibold text-green-400">Online</span>
                  </>
                );
              }
            })()}
          </div>
        </div>

        {/* Sleeping Status Explanation */}
        {status?.online && (status.version?.includes('Sleeping') || status.players.online === 0) && (
          <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
            <p className="text-yellow-200 text-sm">
              🛌 Server is sleeping to save resources. It will automatically wake up when a player joins!
            </p>
          </div>
        )}

        {/* Player Count */}
        {status?.online && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Players:</span>
            <span className="font-semibold text-purple-400">
              {status.players.online} / {status.players.max}
            </span>
          </div>
        )}

        {/* Version */}
        {status?.version && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Version:</span>
            <span className="font-semibold text-purple-400">{status.version}</span>
          </div>
        )}

        {/* Server Address */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Address:</span>
          <span className="font-mono text-sm text-purple-400">{serverAddress}</span>
        </div>

        {/* MOTD */}
        {status?.motd?.clean && status.motd.clean.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Message of the Day:</h4>
            <div className="bg-gray-900/50 rounded-lg p-3">
              {status.motd.clean.map((line, index) => (
                <p key={index} className="text-gray-300 text-sm leading-relaxed">
                  {line.replace(/&#039;/g, "'").replace(/&apos;/g, "'")}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
