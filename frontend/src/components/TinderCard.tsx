import React, { useState, useRef } from 'react';
import { Event } from '../types';
import { Star, MapPin, Calendar, Heart, X } from 'lucide-react';
import { Ripple } from './Ripple';

interface TinderCardProps {
  event: Event;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onClickDetails: () => void;
}

export const TinderCard: React.FC<TinderCardProps> = ({
  event,
  onSwipeLeft,
  onSwipeRight,
  onClickDetails
}) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }

    // Determine if drag was far enough to trigger swipe
    const threshold = 120; // px
    if (dragOffset.x > threshold) {
      // Swipe Right (Like / Favorite)
      onSwipeRight();
    } else if (dragOffset.x < -threshold) {
      // Swipe Left (Nope / Pass)
      onSwipeLeft();
    } else {
      // Return card back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Compute rotation angle based on horizontal drag offset
  const rotation = dragOffset.x * 0.08; // 1 degree per 12.5px
  const scale = isDragging ? 1.02 : 1;

  // Determine LIKE / NOPE overlay opacity
  const likeOpacity = Math.min(Math.max(dragOffset.x / 100, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragOffset.x / 100, 0), 1);

  const formattedDate = new Date(event.startDateTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 rounded-m3-xl overflow-hidden bg-surface border border-surface-outline/60 flex flex-col shadow-elevation-3 select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 10
      }}
    >
      {/* Visual Cover Picture */}
      <div className="relative w-full flex-1 min-h-0 bg-surface-variant overflow-hidden">
        <img
          src={event.photos[0]}
          alt={event.name}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Dynamic LIKE Overlay Badge */}
        <div
          className="absolute top-8 left-8 border-4 border-green-500 text-green-500 rounded-m3-sm px-4 py-1.5 text-2xl font-extrabold uppercase tracking-widest rotate-[-12deg] pointer-events-none transition-opacity"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </div>

        {/* Dynamic NOPE Overlay Badge */}
        <div
          className="absolute top-8 right-8 border-4 border-tertiary text-tertiary rounded-m3-sm px-4 py-1.5 text-2xl font-extrabold uppercase tracking-widest rotate-[12deg] pointer-events-none transition-opacity"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </div>

        {/* Image Vignette gradient */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Floating Top Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-m3-md text-xs font-bold bg-surface/80 backdrop-blur-md text-yellow-400 border border-surface-outline/50 shadow-md">
          <Star className="w-4 h-4 fill-current" />
          <span>{event.score.toFixed(1)}</span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col gap-3.5 shrink-0 bg-background border-t border-surface-outline/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {event.sponsored && (
              <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                Sponsored
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-surface-variant text-textColor-secondary">
              {event.tags[0]}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-textColor-primary leading-tight line-clamp-1">
            {event.name}
          </h2>
        </div>

        <div className="flex flex-col gap-2 text-xs text-textColor-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-primary shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-secondary shrink-0" />
            <span className="truncate">{event.address}</span>
          </div>
        </div>

        {/* Action button deck */}
        <div className="flex justify-between items-center mt-2 gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipeLeft();
            }}
            className="flex-1 h-12 rounded-m3-lg bg-surface border border-surface-outline flex items-center justify-center text-textColor-secondary hover:text-textColor-primary hover:bg-surface-variant transition-colors"
          >
            <X className="w-5 h-5 text-tertiary mr-1" />
            <span className="text-xs font-bold uppercase tracking-wider">Pass</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClickDetails();
            }}
            className="flex-1 h-12 rounded-m3-lg bg-surface border border-surface-outline flex items-center justify-center text-textColor-secondary hover:text-textColor-primary hover:bg-surface-variant transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider">Details</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipeRight();
            }}
            className="flex-1 h-12 rounded-m3-lg bg-primary/25 text-primary border border-primary/45 flex items-center justify-center hover:bg-primary/40 transition-colors"
          >
            <Heart className="w-5 h-5 mr-1 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">Like</span>
          </button>
        </div>
      </div>
    </div>
  );
};
