import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Search, ZoomIn, ZoomOut, Compass, Navigation } from 'lucide-react';
import { Ripple } from './Ripple';

export const MapWidget: React.FC = () => {
  const { events, navigate } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Map Cluj-Napoca events to relative percentages in our mock map coordinate box
  // Event 1 (Polivalenta): {lat: 46.7679, lng: 23.5728} -> x: 25%, y: 55%
  // Event 2 (Memorandumului): {lat: 46.7692, lng: 23.5857} -> x: 50%, y: 40%
  // Event 3 (Central Park): {lat: 46.7699, lng: 23.5794} -> x: 38%, y: 35%
  // Event 4 (Botanical Garden): {lat: 46.7624, lng: 23.5869} -> x: 55%, y: 75%
  // Event 5 (Expo Transilvania): {lat: 46.7791, lng: 23.6212} -> x: 85%, y: 15%
  // Event 6 (BT Tower): {lat: 46.7725, lng: 23.6062} -> x: 72%, y: 22%
  const getMockCoordinates = (id: number) => {
    switch (id) {
      case 1: return { x: 22, y: 58 };
      case 2: return { x: 52, y: 43 };
      case 3: return { x: 36, y: 34 };
      case 4: return { x: 55, y: 78 };
      case 5: return { x: 88, y: 18 };
      case 6: return { x: 75, y: 25 };
      default: return { x: 50, y: 50 };
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="relative w-full h-[280px] rounded-m3-lg border border-surface-outline bg-surface-variant overflow-hidden shadow-elevation-1">
      {/* Visual Vector Grid Backdrop mimicking Dark Map */}
      <div 
        className="absolute inset-0 bg-[#0E0E12] opacity-95" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 40%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 20px 20px, 20px 20px'
        }}
      >
        {/* Mock Road Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          {/* Main Boulevards */}
          <path d="M 0 100 Q 150 120 300 130 T 480 140" fill="none" stroke="#4A4A5A" strokeWidth="4" />
          <path d="M 120 0 L 150 280" fill="none" stroke="#4A4A5A" strokeWidth="3" />
          <path d="M 320 0 L 300 280" fill="none" stroke="#4A4A5A" strokeWidth="3" />
          <path d="M 0 200 L 480 160" fill="none" stroke="#4A4A5A" strokeWidth="2" />
          <path d="M 0 50 Q 200 40 480 80" fill="none" stroke="#3A3A4A" strokeWidth="2" />
          {/* Somes River mockup path */}
          <path d="M 0 120 C 100 110 200 80 300 90 T 480 70" fill="none" stroke="#06B6D4" strokeWidth="6" opacity="0.3" />
        </svg>
      </div>

      {/* Compass / Nav overlay UI */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button className="p-2 rounded-m3-md bg-surface/90 border border-surface-outline text-textColor-primary hover:bg-surface shadow-md">
          <Navigation className="w-4 h-4 text-secondary rotate-45" />
        </button>
        <div className="flex flex-col rounded-m3-md bg-surface/90 border border-surface-outline overflow-hidden shadow-md">
          <button className="p-2 text-textColor-secondary hover:text-textColor-primary border-b border-surface-outline/50">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 text-textColor-secondary hover:text-textColor-primary">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mock User Location Marker */}
      <div className="absolute left-[38%] top-[52%] z-10 flex flex-col items-center">
        <div className="w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white shadow-lg animate-pulse" />
        <div className="px-2 py-0.5 mt-1 rounded bg-secondary/80 text-[8px] font-bold text-white tracking-wider">YOU</div>
      </div>

      {/* Event Pins */}
      {events.map((event) => {
        const coords = getMockCoordinates(event.id);
        const isSelected = selectedEventId === event.id;

        return (
          <div
            key={event.id}
            className="absolute z-20"
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
          >
            <button
              onClick={() => setSelectedEventId(isSelected ? null : event.id)}
              className={`relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-all duration-300 ${
                isSelected ? 'scale-125' : 'hover:scale-115'
              }`}
            >
              {/* Pulse Radar effect for Selected Event or Sponsored Event */}
              {(isSelected || event.sponsored) && <div className="pin-pulse" />}
              
              <MapPin className={`w-7 h-7 ${
                isSelected 
                  ? 'text-tertiary drop-shadow-[0_0_8px_#F43F5E]' 
                  : event.sponsored 
                  ? 'text-primary drop-shadow-[0_0_6px_#A855F7]' 
                  : 'text-secondary'
              }`} fill="currentColor" fillOpacity={0.2} />
            </button>
          </div>
        );
      })}

      {/* Floating Preview Event Banner when a pin is clicked */}
      {selectedEvent && (
        <div className="absolute bottom-3 left-3 right-3 z-30 fade-in glass rounded-m3-md p-3 flex gap-3 border border-surface-outline shadow-elevation-3">
          <img
            src={selectedEvent.photos[0]}
            alt={selectedEvent.name}
            className="w-16 h-16 rounded-m3-sm object-cover bg-surface-variant shrink-0"
          />
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex justify-between items-start gap-1">
                <h4 className="text-xs font-bold text-textColor-primary truncate leading-tight">
                  {selectedEvent.name}
                </h4>
                {selectedEvent.sponsored && (
                  <span className="text-[7px] bg-primary/20 text-primary border border-primary/30 px-1 rounded font-bold uppercase shrink-0">
                    AD
                  </span>
                )}
              </div>
              <p className="text-[10px] text-textColor-secondary truncate mt-0.5">
                {selectedEvent.address}
              </p>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] font-bold text-secondary">
                {selectedEvent.ticketsLeft} tickets left
              </span>
              <button
                onClick={() => navigate('EventDetails', { eventId: selectedEvent.id })}
                className="text-[9px] font-bold text-primary hover:underline px-1 py-0.5 uppercase tracking-wider"
              >
                View Event →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
