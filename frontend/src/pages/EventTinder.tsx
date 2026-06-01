import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TinderCard } from '../components/TinderCard';
import { Sparkles, RefreshCw, Flame, Heart, AlertCircle } from 'lucide-react';
import { Ripple } from '../components/Ripple';

export const EventTinder: React.FC = () => {
  const { events, toggleFavoriteEvent, navigate, currentUser } = useApp();
  
  // Track array of swiped card IDs to hide them
  const [swipedIds, setSwipedIds] = useState<number[]>([]);

  // Filter events belonging to active user location to keep it highly relevant
  const activeLocation = currentUser?.location || 'Cluj-Napoca, Romania';
  const city = activeLocation.split(',')[0].trim();

  const deckEvents = useMemo(() => {
    // Only display events in the current city that aren't already sold out
    return events.filter(e => 
      e.address.toLowerCase().includes(city.toLowerCase()) && 
      e.ticketsLeft > 0
    );
  }, [events, city]);

  const visibleEvents = useMemo(() => {
    return deckEvents.filter(e => !swipedIds.includes(e.id));
  }, [deckEvents, swipedIds]);

  const handleSwipeLeft = (id: number) => {
    setSwipedIds(prev => [...prev, id]);
  };

  const handleSwipeRight = (id: number) => {
    toggleFavoriteEvent(id);
    setSwipedIds(prev => [...prev, id]);
  };

  const handleReset = () => {
    setSwipedIds([]);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-24 bg-background relative overflow-hidden fade-in">
      {/* Decorative Blur Background Node */}
      <div className="absolute top-[20%] right-[-10%] w-[250px] h-[250px] rounded-full bg-primary/5 blur-[70px] pointer-events-none" />

      {/* Screen Title Block */}
      <div className="flex justify-between items-center shrink-0 mb-4 z-10">
        <div>
          <h2 className="text-base font-extrabold text-textColor-primary flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-tertiary" />
            <span>Event Tinder</span>
          </h2>
          <p className="text-[10px] text-textColor-secondary">
            Swipe right to add to Favorites, left to pass!
          </p>
        </div>

        {currentUser && (
          <span className="text-[10px] bg-surface-variant text-textColor-secondary border border-surface-outline px-2.5 py-0.5 rounded-full font-bold">
            {currentUser.favoriteEventIds.length} Favorited
          </span>
        )}
      </div>

      {/* Card Deck Wrapper */}
      <div className="flex-1 min-h-0 w-full relative flex items-center justify-center z-10">
        {visibleEvents.length > 0 ? (
          // Render cards stacked in reverse order so the first item sits on top!
          visibleEvents.map((evt, idx) => {
            const isTop = idx === 0;
            if (!isTop) return null; // Only render top card to save rendering budget and ensure drag capture behaves correctly

            return (
              <TinderCard
                key={evt.id}
                event={evt}
                onSwipeLeft={() => handleSwipeLeft(evt.id)}
                onSwipeRight={() => handleSwipeRight(evt.id)}
                onClickDetails={() => navigate('EventDetails', { eventId: evt.id })}
              />
            );
          })
        ) : (
          /* Empty Deck State */
          <div className="w-full h-full max-h-[460px] rounded-m3-xl border border-surface-outline/50 bg-surface/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 gap-5 shadow-elevation-2 fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            
            <div className="flex flex-col gap-1 max-w-[240px]">
              <h3 className="text-sm font-extrabold text-textColor-primary">All Swept Up!</h3>
              <p className="text-xs text-textColor-secondary leading-relaxed">
                You've swiped all events in {city}. Toggle your preferences, change city, or reset the deck to swipe again.
              </p>
            </div>

            <Ripple className="rounded-m3-md overflow-hidden shrink-0 mt-2">
              <button
                onClick={handleReset}
                className="h-11 px-5 bg-primary/25 border border-primary/45 text-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-primary/35 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Swipe Deck</span>
              </button>
            </Ripple>
          </div>
        )}
      </div>

      {/* Helper Swipe legend indicators */}
      {visibleEvents.length > 0 && (
        <div className="flex justify-center gap-12 text-[10px] text-textColor-secondary shrink-0 pt-4 font-semibold tracking-wider pointer-events-none select-none z-10">
          <span className="flex items-center gap-1 uppercase text-tertiary">
            ← Swipe Left (Nope)
          </span>
          <span className="flex items-center gap-1 uppercase text-primary">
            Swipe Right (Like) →
          </span>
        </div>
      )}
    </div>
  );
};
