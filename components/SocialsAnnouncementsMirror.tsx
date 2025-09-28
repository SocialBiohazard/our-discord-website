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
  attachments: Array<{
    url: string;
    filename: string;
    content_type: string;
  }>;
  embeds: any[];
}

const SocialsAnnouncementsMirror: React.FC = () => {
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [mentions, setMentions] = useState<{ channels?: any; roles?: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/discord/socials-announcements');
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnnouncements, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getAvatarUrl = (author: DiscordMessage['author']) => {
    if (author.avatar) {
      return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=64`;
    }
    // Fallback to default Discord avatar based on discriminator or user ID
    const defaultAvatarIndex = author.discriminator !== '0' 
      ? parseInt(author.discriminator) % 5 
      : parseInt(author.id.slice(-1)) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  };


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">Loading announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-400">Error loading announcements: {error}</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">No announcements available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <img
              src={getAvatarUrl(message.author)}
              alt={message.author.username}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-white font-medium text-sm">
                  {message.author.username}
                </span>
                <span className="text-gray-400 text-xs">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div className="text-gray-300 text-sm break-words">
                {parseDiscordContent(message.content, mentions)}
              </div>
              {message.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index}>
                      {attachment.content_type?.startsWith('image/') ? (
                        <img
                          src={attachment.url}
                          alt={attachment.filename}
                          className="max-w-xs rounded border border-gray-600"
                        />
                      ) : (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          {attachment.filename}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialsAnnouncementsMirror;
