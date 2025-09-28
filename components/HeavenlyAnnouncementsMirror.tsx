import React, { useState, useEffect } from 'react';
import { parseDiscordContent } from '@/utils/discordUtils';

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

export default function HeavenlyAnnouncementsMirror() {
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [mentions, setMentions] = useState<{ channels?: any; roles?: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/discord/heavenly-announcements');
        
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        
        const data = await response.json();
        // Handle both old format (direct array) and new format (object with messages/mentions)
        if (Array.isArray(data)) {
          setMessages(data);
          setMentions({});
        } else {
          setMessages(data.messages || []);
          setMentions(data.mentions || {});
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const getAvatarUrl = (author: DiscordMessage['author']) => {
    if (author.avatar) {
      return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=32`;
    }
    // Default Discord avatar based on discriminator
    const defaultAvatarNum = parseInt(author.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNum}.png`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center py-4">
        <p>❌ Unable to load announcements</p>
        <p className="text-sm text-gray-400 mt-2">{error}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        <p>📢 No recent announcements</p>
        <p className="text-sm mt-2">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <img
              src={getAvatarUrl(message.author)}
              alt={`${message.author.username} avatar`}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-white text-sm">
                  {message.author.username}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(message.timestamp)}
                </span>
                {message.pinned && (
                  <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                    📌 Pinned
                  </span>
                )}
              </div>
              <div className="text-gray-300 text-sm break-words">
                {parseDiscordContent(message.content, mentions)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
