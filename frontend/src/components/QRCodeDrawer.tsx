import React from 'react';
import { Ticket } from '../types';
import { QrCode, Barcode, Calendar, MapPin, User, DollarSign, Clock } from 'lucide-react';

interface QRCodeDrawerProps {
  ticket: Ticket;
}

export const QRCodeDrawer: React.FC<QRCodeDrawerProps> = ({ ticket }) => {
  const formattedBuyTime = new Date(ticket.buyTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex flex-col gap-6 text-textColor-primary">
      {/* Visual Ticket Shell */}
      <div className="relative rounded-m3-lg overflow-hidden border border-surface-outline bg-gradient-to-b from-surface-variant to-surface p-5 flex flex-col gap-4 shadow-elevation-2">
        {/* Ticket Header Accents */}
        <div className="flex justify-between items-center pb-3 border-b border-surface-outline/50">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Ticket ID</span>
            <p className="text-sm font-mono font-bold tracking-wider">{ticket.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-m3-full text-[10px] font-bold uppercase tracking-wider ${
            ticket.type === 'Premium' 
              ? 'bg-tertiary/20 text-tertiary border border-tertiary/30' 
              : ticket.type === 'VIP' 
              ? 'bg-secondary/20 text-secondary border border-secondary/30' 
              : 'bg-primary/20 text-primary border border-primary/30'
          }`}>
            {ticket.type} Access
          </span>
        </div>

        {/* Ticket Body details */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-textColor-primary leading-snug">{ticket.eventName}</h2>
          
          <div className="grid grid-cols-2 gap-3 text-xs text-textColor-secondary mt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>{ticket.eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-secondary shrink-0" />
              <span className="truncate">{ticket.buyerName}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{ticket.eventLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-bold text-textColor-primary">${ticket.price} USD</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{formattedBuyTime}</span>
            </div>
          </div>
        </div>

        {/* Glowing QR Core Container */}
        <div className="flex flex-col items-center gap-2 my-2 py-4 border-t border-b border-dashed border-surface-outline/60">
          <div className="relative w-44 h-44 bg-white p-3 rounded-m3-lg shadow-inner overflow-hidden flex items-center justify-center">
            {/* The laser scanner line */}
            <div className="scanner-line" />
            
            {/* Embedded high-fidelity clean vector QR graphic */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-black">
              <path d="M 0 0 L 30 0 L 30 10 L 10 10 L 10 30 L 0 30 Z" fill="currentColor"/>
              <path d="M 10 10 L 20 10 L 20 20 L 10 20 Z" fill="currentColor"/>
              <path d="M 70 0 L 100 0 L 100 30 L 90 30 L 90 10 L 70 10 Z" fill="currentColor"/>
              <path d="M 80 10 L 90 10 L 90 20 L 80 20 Z" fill="currentColor"/>
              <path d="M 0 70 L 30 70 L 30 100 L 0 100 L 0 90 L 10 90 L 10 80 L 0 80 Z" fill="currentColor"/>
              <path d="M 10 80 L 20 80 L 20 90 L 10 90 Z" fill="currentColor"/>
              {/* Random QR code noise modules */}
              <rect x="40" y="0" width="10" height="10" fill="currentColor"/>
              <rect x="50" y="10" width="10" height="10" fill="currentColor"/>
              <rect x="40" y="30" width="20" height="10" fill="currentColor"/>
              <rect x="10" y="40" width="10" height="20" fill="currentColor"/>
              <rect x="30" y="50" width="20" height="10" fill="currentColor"/>
              <rect x="0" y="50" width="10" height="10" fill="currentColor"/>
              <rect x="60" y="50" width="10" height="20" fill="currentColor"/>
              <rect x="50" y="70" width="15" height="10" fill="currentColor"/>
              <rect x="80" y="40" width="10" height="20" fill="currentColor"/>
              <rect x="90" y="60" width="10" height="10" fill="currentColor"/>
              <rect x="70" y="80" width="20" height="20" fill="currentColor"/>
              <rect x="40" y="90" width="10" height="10" fill="currentColor"/>
              <rect x="30" y="80" width="10" height="10" fill="currentColor"/>
              <rect x="45" y="45" width="10" height="10" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-textColor-secondary">
            SCAN CODE AT ENTRANCE
          </span>
        </div>

        {/* Dynamic Mock Barcode underneath */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-full h-10 opacity-75 text-textColor-primary flex items-center justify-center">
            <Barcode className="w-full h-full stroke-[1px]" />
          </div>
          <span className="text-[9px] font-mono tracking-widest text-textColor-secondary">
            TTRDR-{ticket.id.split('-')[1] || 'CODE'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-1 bg-surface-variant/40 rounded-m3-md border border-surface-outline/30 px-3 py-2.5 text-xs text-textColor-secondary">
        <h4 className="font-bold text-textColor-primary">Entry Guidelines:</h4>
        <ul className="list-disc pl-4 space-y-1">
          <li>Please present this QR code to the usher at the gate.</li>
          <li>Set screen brightness to high for faster scanning.</li>
          <li>This ticket guarantees admission for 1 person only.</li>
        </ul>
      </div>
    </div>
  );
};
