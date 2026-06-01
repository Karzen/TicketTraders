import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, SlidersHorizontal, Map as MapIcon, Grid, Compass, Sparkles } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { MapWidget } from '../components/MapWidget';
import { BottomSheet } from '../components/BottomSheet';
import { Ripple } from '../components/Ripple';

export const Home: React.FC = () => {
  const { events, currentUser, updateUserProfile } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Location selection state
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const locationsList = [
    'Cluj-Napoca, Romania',
    'Bucharest, Romania',
    'Sibiu, Romania',
    'Timisoara, Romania'
  ];

  const categories = ['All', 'Music', 'Tech', 'Food', 'Sports', 'Theatre'];

  const activeLocation = currentUser?.location || 'Cluj-Napoca, Romania';

  const handleLocationChange = (loc: string) => {
    updateUserProfile(
      currentUser?.fullName || 'User',
      currentUser?.email || '',
      currentUser?.profileImage,
      loc
    );
    setIsLocationSheetOpen(false);
  };

  // Filter events based on search query, category chips, and location bounds
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // 1. Search filter
      const matchesSearch = searchQuery === '' || 
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.address.toLowerCase().includes(searchQuery.toLowerCase());
        
      // 2. Category tag filter
      const matchesCategory = selectedCategory === 'All' || 
        evt.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase());
        
      // 3. Location filter (Check if event address contains city name)
      const city = activeLocation.split(',')[0].trim();
      const matchesLocation = evt.address.toLowerCase().includes(city.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [events, searchQuery, selectedCategory, activeLocation]);

  // Separate sponsored events from normal events
  const sponsoredEvents = useMemo(() => {
    return events.filter(e => e.sponsored);
  }, [events]);

  const recommendedEvents = useMemo(() => {
    return events
      .filter(e => !e.sponsored && e.score >= 4.7)
      .sort((a, b) => b.score - a.score);
  }, [events]);

  return (
    <div className="flex-1 flex flex-col gap-6 pb-24 fade-in">
      {/* Top Banner Greeting */}
      <div className="px-4 pt-4 flex justify-between items-center">
        <div>
          <span className="text-xs text-textColor-secondary">Hello, welcome back!</span>
          <h2 className="text-lg font-black text-textColor-primary leading-tight">
            {currentUser ? currentUser.fullName.split(' ')[0] : 'Guest'} 👋
          </h2>
        </div>
        
        {/* Dynamic Location Chip Trigger */}
        <Ripple
          onClick={() => setIsLocationSheetOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full bg-surface-variant text-secondary border border-surface-outline/50 shadow-sm transition-colors text-xs font-semibold"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{activeLocation.split(',')[0]}</span>
        </Ripple>
      </div>

      {/* Search Input and View Toggles */}
      <div className="px-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-secondary pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, organizers, addresses..."
            className="w-full h-11 pl-9 pr-4 rounded-m3-md bg-surface border border-surface-outline focus:outline-none focus:border-primary text-textColor-primary text-xs transition-colors"
          />
        </div>
        
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
          className="p-3 rounded-m3-md bg-surface-variant border border-surface-outline text-textColor-primary hover:bg-surface-outline/30 shadow-sm"
          title={viewMode === 'grid' ? 'Map view' : 'Grid view'}
        >
          {viewMode === 'grid' ? <MapIcon className="w-4.5 h-4.5 text-primary" /> : <Grid className="w-4.5 h-4.5 text-secondary" />}
        </button>
      </div>

      {/* Categories chips horizontal layout */}
      <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-m3-full text-xs font-bold whitespace-nowrap border shrink-0 transition-all ${
                isSelected
                  ? 'bg-primary text-white border-transparent shadow-sm'
                  : 'bg-surface text-textColor-secondary border-surface-outline hover:text-textColor-primary hover:bg-surface-variant/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {viewMode === 'map' ? (
        /* Dynamic map locator deck */
        <div className="px-4 flex flex-col gap-4">
          <div>
            <h3 className="text-base font-extrabold text-textColor-primary flex items-center gap-1.5">
              <Compass className="w-5 h-5 text-secondary" />
              <span>Events Near You</span>
            </h3>
            <p className="text-[10px] text-textColor-secondary mt-0.5">
              Showing events around {activeLocation.split(',')[0]}
            </p>
          </div>
          <MapWidget />
        </div>
      ) : (
        /* Standard Discover grid flow */
        <>
          {/* Sponsored Events Carousel (only shows if no active searches) */}
          {searchQuery === '' && selectedCategory === 'All' && sponsoredEvents.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="px-4 flex items-center gap-1">
                <Sparkles className="w-4.5 h-4.5 text-yellow-400 fill-current" />
                <h3 className="text-sm font-extrabold text-textColor-primary uppercase tracking-wider">
                  Featured Banners
                </h3>
              </div>
              
              <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar py-1">
                {sponsoredEvents.map((evt) => (
                  <div key={evt.id} className="w-[280px] shrink-0">
                    <EventCard event={evt} variant="elevated" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Events section */}
          <div className="px-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-textColor-primary uppercase tracking-wider">
                {searchQuery !== '' || selectedCategory !== 'All' ? 'Search Results' : `Events in ${activeLocation.split(',')[0]}`}
              </h3>
              <span className="text-[10px] font-bold text-textColor-secondary bg-surface-variant px-2.5 py-0.5 rounded-m3-sm border border-surface-outline/50">
                {filteredEvents.length} items
              </span>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} variant="outlined" />
                ))}
              </div>
            ) : (
              <div className="glass rounded-m3-lg p-8 border border-surface-outline text-center flex flex-col items-center gap-2">
                <MapPin className="w-8 h-8 text-tertiary animate-pulse" />
                <h4 className="text-sm font-bold text-textColor-primary">No local events found</h4>
                <p className="text-xs text-textColor-secondary max-w-[240px]">
                  There are no listings matching "{selectedCategory}" in {activeLocation.split(',')[0]} yet. Try changing your location!
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Location Picker Slide Sheet */}
      <BottomSheet
        isOpen={isLocationSheetOpen}
        onClose={() => setIsLocationSheetOpen(false)}
        title="Select Active City"
      >
        <div className="flex flex-col gap-2">
          {locationsList.map((loc) => {
            const isSelected = activeLocation === loc;
            return (
              <Ripple
                key={loc}
                onClick={() => handleLocationChange(loc)}
                className={`w-full p-4 rounded-m3-md border text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary font-bold'
                    : 'bg-surface border-surface-outline text-textColor-primary hover:bg-surface-variant'
                }`}
              >
                <span>{loc}</span>
                {isSelected && <MapPin className="w-5 h-5 text-primary" />}
              </Ripple>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
};
