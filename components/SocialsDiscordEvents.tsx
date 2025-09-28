import React, { useState, useEffect } from 'react';
import { cleanDiscordContent } from '@/utils/discordUtils';

interface DiscordEvent {
  id: string;
  name: string;
  description: string | null;
  scheduled_start_time: string;
  scheduled_end_time: string | null;
  status: number;
  entity_type: number;
  entity_id: string | null;
  creator_id: string | null;
  user_count: number | null;
  image: string | null;
}

const SocialsDiscordEvents: React.FC = () => {
  const [events, setEvents] = useState<DiscordEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/discord/socials-events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchEvents, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (daysDiff === 1) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (daysDiff < 7) {
      return `${date.toLocaleDateString([], { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };


  const getEventUrl = (eventId: string) => {
    return `https://discord.gg/events/694912331267964961/${eventId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-400">Error loading events: {error}</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">No upcoming events</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm mb-1">
                {event.name}
              </h4>
              {event.description && (
                <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                  {cleanDiscordContent(event.description)}
                </p>
              )}
              <p className="text-gray-400 text-xs">
                📅 {formatEventDate(event.scheduled_start_time)}
              </p>
              {event.user_count && (
                <p className="text-gray-400 text-xs mt-1">
                  👥 {event.user_count} interested
                </p>
              )}
            </div>
            <a
              href={getEventUrl(event.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200"
            >
              View Event
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialsDiscordEvents;
