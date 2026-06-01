import React from 'react';
import { Event } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Star, Ticket } from 'lucide-react';
import { Ripple } from './Ripple';

interface EventCardProps {
  event: Event;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export const EventCard: React.FC<EventCardProps> = ({ event, variant = 'elevated' }) => {
  const { navigate } = useApp();

  const formattedDate = new Date(event.startDateTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return 'bg-transparent border border-surface-outline hover:bg-surface-variant/20';
      case 'filled':
        return 'bg-surface-variant border border-transparent hover:bg-surface-variant/80';
      case 'elevated':
      default:
        return 'bg-surface shadow-elevation-1 hover:shadow-elevation-2 border border-surface-outline/50';
    }
  };

  const getLowestPrice = () => {
    if (event.ticketTypes.length === 0) return 0;
    return Math.min(...event.ticketTypes.map(t => t.price));
  };

  const percentLeft = Math.round((event.ticketsLeft / event.capacity) * 100);

  return (
    <Ripple
      onClick={() => navigate('EventDetails', { eventId: event.id })}
      className={`rounded-m3-lg overflow-hidden flex flex-col transition-all duration-300 group cursor-pointer ${getVariantStyles()}`}
    >
      {/* Event Cover Photo */}
      <div className="relative w-full h-44 overflow-hidden bg-surface-variant">
        <img
          src={event.photos[0]}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
          {event.sponsored ? (
            <span className="px-2.5 py-1 rounded-m3-sm text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-secondary text-white shadow-elevation-1">
              Sponsored
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-m3-sm text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-textColor-primary">
              Event
            </span>
          )}
          
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-m3-sm text-xs font-bold bg-surface-variant/90 backdrop-blur-md text-yellow-400 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{event.score.toFixed(1)}</span>
          </div>
        </div>

        {/* Floating Price Tag */}
        <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-md border border-surface-outline/60 px-3 py-1 rounded-m3-md font-bold text-sm text-secondary shadow-md">
          {getLowestPrice() === 0 ? 'FREE' : `$${getLowestPrice()}+`}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-base font-bold text-textColor-primary leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {event.name}
        </h3>
        
        <div className="flex flex-col gap-1.5 text-xs text-textColor-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary/80 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-secondary/80 shrink-0 line-clamp-1" />
            <span className="truncate">{event.address}</span>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-1 mt-1">
          {event.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-m3-sm text-[10px] font-semibold bg-surface-variant text-textColor-secondary border border-surface-outline/40"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Tickets Left Progress Indicator */}
        <div className="mt-3 pt-2 border-t border-surface-outline/40 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-semibold text-textColor-secondary">
            <span className="flex items-center gap-1 text-primary">
              <Ticket className="w-3.5 h-3.5" />
              <span>{event.ticketsLeft} / {event.capacity} left</span>
            </span>
            <span>{percentLeft}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentLeft < 15 
                  ? 'bg-tertiary' 
                  : percentLeft < 40 
                  ? 'bg-yellow-500' 
                  : 'bg-primary'
              }`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>
        </div>
      </div>
    </Ripple>
  );
};
