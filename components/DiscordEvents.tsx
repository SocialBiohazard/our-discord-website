import React, { useState, useEffect } from 'react';
import { cleanDiscordContent } from '@/utils/discordUtils';

interface DiscordEvent {
  id: string;
  name: string;
  description?: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  entity_metadata?: {
    location?: string;
  };
}

export default function DiscordEvents() {
  const [events, setEvents] = useState<DiscordEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/discord/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.slice(0, 5)); // Show only next 5 events
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-neon-cyan/20 rounded mb-2"></div>
            <div className="h-3 bg-neon-cyan/10 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-vhs-red font-terminal text-sm">
          {error}
        </p>
        <button 
          onClick={fetchEvents}
          className="text-neon-cyan text-sm mt-2 hover:text-neon-yellow transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-4 text-text-secondary">
        <p className="font-terminal">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div 
          key={event.id}
          className="border border-neon-cyan/30 rounded p-3 bg-black/30 hover:border-neon-cyan/60 transition-colors"
        >
          <h4 className="font-terminal text-neon-cyan text-sm mb-1">
            {event.name}
          </h4>
          <p className="text-xs text-text-secondary mb-2">
            {formatDate(event.scheduled_start_time)}
          </p>
          {event.description && (
            <p className="text-xs text-text-secondary line-clamp-2">
              {cleanDiscordContent(event.description).slice(0, 100)}...
            </p>
          )}
          <a
            href={`https://discord.com/events/${process.env.NEXT_PUBLIC_DISCORD_GUILD_ID}/${event.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs text-neon-pink hover:text-neon-yellow transition-colors"
          >
            View Event →
          </a>
        </div>
      ))}
    </div>
  );
}
