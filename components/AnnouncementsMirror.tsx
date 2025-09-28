import React, { useState, useEffect } from 'react';
import { parseDiscordContent } from '@/utils/discordUtils';

interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    discriminator: string;
  };
  timestamp: string;
  pinned: boolean;
}

export default function AnnouncementsMirror() {
  const [announcements, setAnnouncements] = useState<DiscordMessage[]>([]);
  const [mentions, setMentions] = useState<{ channels?: any; roles?: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/discord/announcements');
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      
      const data = await response.json();
      // Handle both old format (direct array) and new format (object with messages/mentions)
      if (Array.isArray(data)) {
        setAnnouncements(data.slice(0, 5));
        setMentions({});
      } else {
        setAnnouncements(data.messages?.slice(0, 5) || []);
        setMentions(data.mentions || {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };


  const getAvatarUrl = (author: DiscordMessage['author']) => {
    if (author.avatar && author.id) {
      return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=64`;
    }
    // Discord default avatar based on discriminator
    const defaultNum = author.discriminator === "0" 
      ? (parseInt(author.id) >> 22) % 6  // New username system
      : parseInt(author.discriminator) % 5; // Old discriminator system
    return `https://cdn.discordapp.com/embed/avatars/${defaultNum}.png`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse border border-gray-600 rounded-lg p-4 bg-gray-800/30">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-2 w-1/3"></div>
                <div className="h-3 bg-gray-700 rounded mb-1 w-full"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 border border-gray-600 rounded-lg bg-gray-800/30">
        <p className="text-red-400 font-orbitron text-sm mb-3">
          {error}
        </p>
        <button 
          onClick={fetchAnnouncements}
          className="text-cyan-400 hover:text-cyan-300 text-sm border border-gray-600 px-4 py-2 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 border border-gray-600 rounded-lg bg-gray-800/30">
        <p className="text-gray-400 font-orbitron">No announcements available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((msg) => (
        <div 
          key={msg.id}
          className="border border-gray-600 rounded-lg p-4 bg-gray-800/30 hover:border-gray-500 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <img
              src={getAvatarUrl(msg.author)}
              alt={msg.author.username}
              className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Fallback to default Discord avatar
                const defaultNum = msg.author.discriminator === "0" 
                  ? (parseInt(msg.author.id) >> 22) % 6
                  : parseInt(msg.author.discriminator) % 5;
                target.src = `https://cdn.discordapp.com/embed/avatars/${defaultNum}.png`;
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-orbitron text-white text-sm font-medium">
                  {msg.author.username}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(msg.timestamp)}
                </span>
                {msg.pinned && (
                  <span className="text-yellow-400 text-xs">📌</span>
                )}
              </div>
              <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                {parseDiscordContent(msg.content, mentions)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
