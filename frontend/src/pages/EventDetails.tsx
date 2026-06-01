import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Star, User, ShieldAlert, CheckCircle, Ticket as TicketIcon, Clock, ChevronRight } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { Ripple } from '../components/Ripple';

export const EventDetails: React.FC = () => {
  const { events, navigationPayload, buyTicket, toggleFavoriteEvent, currentUser } = useApp();
  const eventId = navigationPayload?.eventId;
  
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isCheckoutSheetOpen, setIsCheckoutSheetOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<'Standard' | 'VIP' | 'Premium'>('Standard');
  const [buyingStatus, setBuyingStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-textColor-secondary">
        <ShieldAlert className="w-12 h-12 text-tertiary mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-textColor-primary">Event Not Found</h3>
        <p className="text-xs">The requested event details could not be parsed.</p>
      </div>
    );
  }

  const isFavorite = currentUser?.favoriteEventIds.includes(event.id) || false;

  const formattedDate = new Date(event.startDateTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = `${new Date(event.startDateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })} - ${new Date(event.endDateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;

  const getTicketPrice = (type: 'Standard' | 'VIP' | 'Premium') => {
    return event.ticketTypes.find(t => t.type === type)?.price ?? 0;
  };

  const getTicketRemaining = (type: 'Standard' | 'VIP' | 'Premium') => {
    return event.ticketTypes.find(t => t.type === type)?.ticketsLeft ?? 0;
  };

  const handleCheckoutOpen = (type: 'Standard' | 'VIP' | 'Premium') => {
    setSelectedTicketType(type);
    setBuyingStatus('idle');
    setIsCheckoutSheetOpen(true);
  };

  const handleBuy = async () => {
    setBuyingStatus('processing');
    const price = getTicketPrice(selectedTicketType);
    
    // Simulate payment processing latency
    setTimeout(async () => {
      const success = await buyTicket(event.id, selectedTicketType, price);
      if (success) {
        setBuyingStatus('success');
      } else {
        setBuyingStatus('failed');
      }
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col pb-24 fade-in bg-background">
      {/* Visual Cover Carousel Header */}
      <div className="relative w-full h-64 bg-surface-variant overflow-hidden shrink-0">
        <img
          src={event.photos[selectedPhotoIdx]}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* Favorite Floating Toggle Button */}
        <button
          onClick={() => toggleFavoriteEvent(event.id)}
          className={`absolute bottom-4 right-4 p-3 rounded-full shadow-elevation-2 border transition-all ${
            isFavorite
              ? 'bg-tertiary border-transparent text-white scale-110'
              : 'bg-surface/90 border-surface-outline text-textColor-secondary hover:text-textColor-primary hover:scale-105'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-5.5 h-5.5"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Floating Top Indicator Accent */}
        <div className="absolute top-4 left-4 flex gap-2">
          {event.sponsored && (
            <span className="px-2.5 py-1 rounded text-[9px] font-bold bg-primary text-white uppercase tracking-wider shadow-elevation-1">
              Sponsored
            </span>
          )}
          <span className="px-2.5 py-1 rounded text-[9px] font-bold bg-surface/90 backdrop-blur-md text-yellow-400 border border-surface-outline/50 flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{event.score.toFixed(1)}</span>
          </span>
        </div>
      </div>

      {/* Image Gallery Horizontal Carousel Indicators */}
      {event.photos.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto px-4 py-2 shrink-0">
          {event.photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIdx(idx)}
              className={`relative w-16 h-12 rounded-m3-sm overflow-hidden shrink-0 border-2 transition-all ${
                selectedPhotoIdx === idx ? 'border-primary scale-102' : 'border-surface-outline opacity-60'
              }`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Detail Content Core Body */}
      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Title Block */}
        <div>
          <div className="flex flex-wrap gap-1 mb-1.5">
            {event.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] font-bold text-textColor-secondary bg-surface-variant border border-surface-outline/40 px-2 py-0.5 rounded-m3-sm">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-xl font-black text-textColor-primary leading-tight">{event.name}</h1>
        </div>

        {/* Meta Info Rows */}
        <div className="flex flex-col gap-3 p-3.5 bg-surface border border-surface-outline/60 rounded-m3-lg text-xs">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-textColor-primary">{formattedDate}</span>
              <span className="text-[10px] text-textColor-secondary flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-secondary" />
                <span>{formattedTime}</span>
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-surface-outline/50">
            <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-textColor-primary">{event.address}</span>
              <span className="text-[10px] text-textColor-secondary mt-0.5">
                GPS: {event.coordinates.lat.toFixed(4)}, {event.coordinates.lng.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-surface-outline/50">
            <User className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] text-textColor-secondary uppercase tracking-wider font-semibold">Organized By</span>
              <span className="font-bold text-textColor-primary mt-0.5">{event.organizerName}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-textColor-secondary">About This Event</h3>
          <p className="text-xs text-textColor-secondary leading-relaxed bg-surface-variant/20 p-3.5 rounded-m3-lg border border-surface-outline/30">
            {event.description}
          </p>
        </div>

        {/* Ticket Tiers Selection Drawer Header */}
        <div className="flex flex-col gap-2.5 mt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-textColor-secondary">Ticket Options</h3>
          
          <div className="flex flex-col gap-3">
            {event.ticketTypes.map((tier) => {
              const price = tier.price;
              const remaining = tier.ticketsLeft;
              const isSoldOut = remaining <= 0;

              return (
                <div
                  key={tier.type}
                  className={`p-4 rounded-m3-lg border flex justify-between items-center bg-surface transition-all ${
                    isSoldOut
                      ? 'border-surface-outline opacity-50'
                      : 'border-surface-outline/80 hover:border-primary shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-textColor-primary">{tier.type} Tier</span>
                      <span className="text-[9px] bg-surface-variant text-textColor-secondary px-1.5 py-0.5 rounded border border-surface-outline/40">
                        {remaining} left
                      </span>
                    </div>
                    <span className="text-[10px] text-textColor-secondary">Full general entry permissions</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-secondary">
                      {price === 0 ? 'FREE' : `$${price}`}
                    </span>
                    
                    <Ripple className="rounded-m3-md overflow-hidden shrink-0">
                      <button
                        onClick={() => handleCheckoutOpen(tier.type)}
                        disabled={isSoldOut}
                        className={`h-9 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center ${
                          isSoldOut
                            ? 'bg-surface-outline text-textColor-disabled'
                            : 'bg-primary text-white hover:opacity-90 active:opacity-100'
                        }`}
                      >
                        {isSoldOut ? 'Sold Out' : 'Select'}
                      </button>
                    </Ripple>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Ticket Purchase Bottom Sheet */}
      <BottomSheet
        isOpen={isCheckoutSheetOpen}
        onClose={() => setIsCheckoutSheetOpen(false)}
        title="Confirm Ticket Purchase"
      >
        {buyingStatus === 'idle' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-m3-lg border border-surface-outline/80 bg-surface flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-surface-outline/50 pb-2.5">
                <div>
                  <h4 className="text-sm font-extrabold text-textColor-primary">{event.name}</h4>
                  <p className="text-[10px] text-textColor-secondary mt-0.5">{selectedTicketType} Tier Ticket</p>
                </div>
                <TicketIcon className="w-6 h-6 text-primary" />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-textColor-secondary">Unit Ticket Price</span>
                <span className="font-bold text-textColor-primary">
                  {getTicketPrice(selectedTicketType) === 0 ? 'FREE' : `$${getTicketPrice(selectedTicketType)}.00 USD`}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-textColor-secondary">Service Fees</span>
                <span className="font-bold text-textColor-primary">$0.00 USD</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black border-t border-surface-outline/50 pt-2.5">
                <span className="text-textColor-primary">Total Amount Due</span>
                <span className="text-secondary">
                  {getTicketPrice(selectedTicketType) === 0 ? 'FREE' : `$${getTicketPrice(selectedTicketType)}.00 USD`}
                </span>
              </div>
            </div>

            <Ripple className="w-full rounded-m3-md overflow-hidden">
              <button
                onClick={handleBuy}
                className="w-full h-12 bg-secondary text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center hover:opacity-90 active:opacity-100"
              >
                Complete Checkout & Pay
              </button>
            </Ripple>
          </div>
        )}

        {buyingStatus === 'processing' && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            {/* Spinning Material Loader */}
            <div className="w-12 h-12 rounded-full border-4 border-surface-outline border-t-primary animate-spin" />
            <h4 className="text-sm font-bold text-textColor-primary">Authorizing Payment...</h4>
            <p className="text-xs text-textColor-secondary max-w-[200px]">
              Securely processing credit allocations. Please do not close this drawer.
            </p>
          </div>
        )}

        {buyingStatus === 'success' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 fill-green-500/10 animate-bounce" />
            <div>
              <h4 className="text-base font-black text-textColor-primary">Purchase Approved!</h4>
              <p className="text-xs text-textColor-secondary mt-1">
                Your ticket has been generated and saved under "My Tickets"
              </p>
            </div>
            
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setIsCheckoutSheetOpen(false)}
                className="flex-1 h-10 rounded-m3-md border border-surface-outline bg-surface-variant/40 hover:bg-surface-variant text-xs font-bold text-textColor-secondary transition-colors"
              >
                Close Drawer
              </button>
              <Ripple className="flex-1 rounded-m3-md overflow-hidden">
                <button
                  onClick={() => {
                    setIsCheckoutSheetOpen(false);
                    // Navigate to Tickets page
                    setTimeout(() => {
                      const contextState = document.getElementById('tickets-tab-trigger');
                      if (contextState) contextState.click();
                      const tickClick = document.getElementById('tickets-sub-tab');
                      if (tickClick) tickClick.click();
                    }, 50);
                    // Standard context navigate
                    const nav = (window as any)._appContextNavigate;
                    if (nav) {
                      nav('Tickets');
                    }
                  }}
                  className="w-full h-10 bg-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center"
                >
                  View My Tickets
                </button>
              </Ripple>
            </div>
          </div>
        )}

        {buyingStatus === 'failed' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <ShieldAlert className="w-14 h-14 text-tertiary fill-tertiary/10" />
            <div>
              <h4 className="text-base font-black text-textColor-primary">Transaction Declined</h4>
              <p className="text-xs text-textColor-secondary mt-1">
                Ticket quantities are sold out, or payment authorization timed out.
              </p>
            </div>
            
            <button
              onClick={() => setIsCheckoutSheetOpen(false)}
              className="w-full h-10 rounded-m3-md border border-surface-outline bg-surface-variant/40 hover:bg-surface-variant text-xs font-bold text-textColor-secondary"
            >
              Go Back
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
