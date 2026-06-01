export interface TicketTypeInfo {
  type: 'Standard' | 'VIP' | 'Premium';
  price: number;
  quantity: number;
  ticketsLeft: number;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  organizerName: string;
  address: string;
  coordinates: { lat: number; lng: number };
  startDateTime: string;
  endDateTime: string;
  tags: string[];
  capacity: number;
  ticketsLeft: number;
  sponsored: boolean;
  score: number;
  ticketTypes: TicketTypeInfo[];
  photos: string[];
}

export interface User {
  id: number;
  isOrganizer: boolean;
  fullName: string;
  email: string;
  password?: string;
  profileImage?: string;
  favoriteEventIds: number[];
  friendIds: number[];
  ticketIds: string[];
  location?: string;
}

export interface Ticket {
  id: string;
  eventId: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  buyerName: string;
  buyTime: string;
  price: number;
  qrCodeData: string;
  type: 'Standard' | 'VIP' | 'Premium';
}

export interface Message {
  id: string;
  senderId: number;
  recipientId: number;
  text: string;
  timestamp: string;
}

export interface FriendFeedActivity {
  id: string;
  friendId: number;
  friendName: string;
  friendAvatar: string;
  actionType: 'going' | 'interested' | 'promoted';
  eventName: string;
  eventId: number;
  timestamp: string;
}
