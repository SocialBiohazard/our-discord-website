import React, { useState, useEffect } from 'react';
import { cleanDiscordContent } from '@/utils/discordUtils';

interface DiscordEvent {
  id: string;
  name: string;
  description: string | null;
  scheduled_start_time: string;
  scheduled_end_time: string | null;
  entity_metadata: any;
  user_count: number | null;
  image: string | null;
}

export default function HeavenlyDiscordEvents() {
  const [events, setEvents] = useState<DiscordEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/discord/heavenly-events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
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
    const diffInHours = Math.abs(date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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
        <p>❌ Unable to load events</p>
        <p className="text-sm text-gray-400 mt-2">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        <p>📅 No upcoming events</p>
        <p className="text-sm mt-2">Stay tuned for future events!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{event.name}</h4>
              
              {event.description && (
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {cleanDiscordContent(event.description)}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>{formatEventDate(event.scheduled_start_time)}</span>
                </div>
                
                {event.user_count !== null && (
                  <div className="flex items-center space-x-1">
                    <span>👥</span>
                    <span>{event.user_count} interested</span>
                  </div>
                )}
              </div>
            </div>
            
            {event.image && (
              <img
                src={`https://cdn.discordapp.com/guild-events/${event.id}/${event.image}.png?size=96`}
                alt={event.name}
                className="w-16 h-16 rounded-lg object-cover ml-4 flex-shrink-0"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
