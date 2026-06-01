import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket as TicketIcon, Heart, Calendar, MapPin, ChevronDown, ChevronUp, Ticket as TicketOutline, Sparkles } from 'lucide-react';
import { QRCodeDrawer } from '../components/QRCodeDrawer';
import { EventCard } from '../components/EventCard';
import { BottomSheet } from '../components/BottomSheet';
import { Ripple } from '../components/Ripple';

export const Tickets: React.FC = () => {
  const { tickets, events, currentUser } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'tickets' | 'favorites'>('tickets');
  
  // Track which ticket is expanded to show its live scanning QR code
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // Filter bought tickets belonging to active logged-in user
  const userTickets = useMemo(() => {
    if (!currentUser) return [];
    return tickets.filter(t => currentUser.ticketIds.includes(t.id));
  }, [tickets, currentUser]);

  // Filter events favorited by active user
  const favoriteEvents = useMemo(() => {
    if (!currentUser) return [];
    return events.filter(e => currentUser.favoriteEventIds.includes(e.id));
  }, [events, currentUser]);

  const toggleExpandTicket = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-24 bg-background relative overflow-hidden fade-in">
      {/* Decorative background nodes */}
      <div className="absolute top-[-10%] left-[-15%] w-[250px] h-[250px] rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />

      {/* Segmented Sub-Tab Control (M3 Pills style) */}
      <div className="flex p-1 bg-surface-variant rounded-m3-lg border border-surface-outline shrink-0 mb-5 relative z-10">
        <button
          id="tickets-sub-tab"
          onClick={() => setActiveSubTab('tickets')}
          className={`flex-1 py-2.5 rounded-m3-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'tickets'
              ? 'bg-surface text-secondary shadow-sm'
              : 'text-textColor-secondary hover:text-textColor-primary'
          }`}
        >
          <TicketIcon className="w-4 h-4" />
          <span>My Tickets ({userTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('favorites')}
          className={`flex-1 py-2.5 rounded-m3-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'favorites'
              ? 'bg-surface text-primary shadow-sm'
              : 'text-textColor-secondary hover:text-textColor-primary'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites ({favoriteEvents.length})</span>
        </button>
      </div>

      {/* Tabs Content Deck */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        {activeSubTab === 'tickets' ? (
          /* BOUGHT TICKETS ACTIVE DRAWER ACCORDIONS */
          userTickets.length > 0 ? (
            <div className="flex flex-col gap-4">
              {userTickets.map((ticket) => {
                const isExpanded = expandedTicketId === ticket.id;
                
                return (
                  <div
                    key={ticket.id}
                    className="rounded-m3-lg overflow-hidden border border-surface-outline bg-surface shadow-sm transition-all"
                  >
                    {/* Header Row */}
                    <button
                      onClick={() => toggleExpandTicket(ticket.id)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-surface-variant/40 transition-colors focus:outline-none"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            ticket.type === 'Premium' 
                              ? 'bg-tertiary/20 text-tertiary border border-tertiary/25' 
                              : ticket.type === 'VIP' 
                              ? 'bg-secondary/20 text-secondary border border-secondary/25' 
                              : 'bg-primary/20 text-primary border border-primary/25'
                          }`}>
                            {ticket.type}
                          </span>
                          <span className="text-[10px] font-mono text-textColor-secondary">
                            {ticket.id}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-textColor-primary leading-tight truncate">
                          {ticket.eventName}
                        </h3>
                        <p className="text-[10px] text-textColor-secondary mt-0.5 truncate">
                          {ticket.eventDate} • {ticket.eventLocation}
                        </p>
                      </div>
                      
                      <div className="shrink-0 text-textColor-secondary">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {/* Expandable Live Scan Drawer */}
                    {isExpanded && (
                      <div className="p-4 border-t border-surface-outline/50 bg-background/40">
                        <QRCodeDrawer ticket={ticket} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty active tickets state */
            <div className="glass rounded-m3-lg p-10 border border-surface-outline text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                <TicketOutline className="w-6 h-6 text-secondary animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-textColor-primary">No Tickets Yet</h4>
              <p className="text-xs text-textColor-secondary max-w-[240px]">
                You haven't bought any tickets for upcoming events. Head back to the explore tab and choose a ticket tier!
              </p>
            </div>
          )
        ) : (
          /* FAVORITE EVENTS GRID FLOW */
          favoriteEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} variant="outlined" />
              ))}
            </div>
          ) : (
            /* Empty favorites state */
            <div className="glass rounded-m3-lg p-10 border border-surface-outline text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary">
                <Heart className="w-6 h-6 text-tertiary animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-textColor-primary">No Favorites Yet</h4>
              <p className="text-xs text-textColor-secondary max-w-[240px]">
                Events you like or swipe right on in Tinder discovery will automatically appear here. Give it a try!
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
