import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Event, Ticket, Message, FriendFeedActivity } from '../types';
import { INITIAL_USERS, INITIAL_EVENTS, INITIAL_FEED_ACTIVITIES, INITIAL_MESSAGES } from '../database/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  events: Event[];
  tickets: Ticket[];
  feedActivities: FriendFeedActivity[];
  messages: Message[];
  currentPage: string;
  navigationPayload: any;
  navigate: (page: string, payload?: any) => void;
  goBack: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string, isOrganizer: boolean) => Promise<boolean>;
  logout: () => void;
  toggleFavoriteEvent: (eventId: number) => void;
  buyTicket: (eventId: number, type: 'Standard' | 'VIP' | 'Premium', price: number) => Promise<boolean>;
  createEvent: (eventData: Omit<Event, 'id' | 'ticketsLeft' | 'score' | 'photos'> & { photos: string[] }) => void;
  sendMessage: (recipientId: number, text: string) => void;
  updateUserProfile: (fullName: string, email: string, profileImage?: string, location?: string) => void;
  toggleOrganizerMode: () => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const cached = localStorage.getItem('tt_users');
    return cached ? JSON.parse(cached) : INITIAL_USERS;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const cached = localStorage.getItem('tt_events');
    return cached ? JSON.parse(cached) : INITIAL_EVENTS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const cached = localStorage.getItem('tt_tickets');
    if (cached) return JSON.parse(cached);
    
    // Create initial ticket for Alex
    const alexTicket: Ticket = {
      id: "TKT-1001",
      eventId: 1,
      eventName: "Neon Horizon Music Festival",
      eventDate: "July 15, 2026",
      eventLocation: "Polivalenta Arena Lawn, Cluj-Napoca",
      buyerName: "Alex Mercer",
      buyTime: "2026-05-30T14:20:00Z",
      price: 150,
      qrCodeData: "TKT-1001-NEON-HORIZON-STANDARD-ALEX",
      type: 'Standard'
    };
    return [alexTicket];
  });

  const [feedActivities, setFeedActivities] = useState<FriendFeedActivity[]>(() => {
    const cached = localStorage.getItem('tt_feed');
    return cached ? JSON.parse(cached) : INITIAL_FEED_ACTIVITIES;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const cached = localStorage.getItem('tt_messages');
    return cached ? JSON.parse(cached) : INITIAL_MESSAGES;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('tt_current_user');
    return cached ? JSON.parse(cached) : INITIAL_USERS[0];
  });

  const [currentPage, setCurrentPage] = useState<string>(() => {
    const cachedUser = localStorage.getItem('tt_current_user');
    return cachedUser ? 'Home' : 'Login';
  });

  const [navigationPayload, setNavigationPayload] = useState<any>(null);
  const [navHistory, setNavHistory] = useState<string[]>(() => {
    const cachedUser = localStorage.getItem('tt_current_user');
    return cachedUser ? ['Home'] : ['Login'];
  });

  const navigate = (page: string, payload: any = null) => {
    setCurrentPage(page);
    setNavigationPayload(payload);
    setNavHistory(prev => [...prev, page]);
  };

  const goBack = () => {
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop(); // Remove current
      const prevPage = newHistory[newHistory.length - 1];
      setCurrentPage(prevPage);
      setNavigationPayload(payloadForPage(prevPage, newHistory));
      setNavHistory(newHistory);
    } else {
      setCurrentPage('Home');
    }
  };

  // Small helper to restore relevant payload if we go back
  const payloadForPage = (page: string, history: string[]) => {
    return null; // Can extend if needed, defaults to null for safety
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tt_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tt_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('tt_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('tt_feed', JSON.stringify(feedActivities));
  }, [feedActivities]);

  useEffect(() => {
    localStorage.setItem('tt_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tt_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tt_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('Home');
      setNavHistory(['Home']);
      return true;
    }
    return false;
  };

  const register = async (fullName: string, email: string, password: string, isOrganizer: boolean): Promise<boolean> => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const newUser: User = {
      id: Date.now(),
      fullName,
      email,
      password,
      isOrganizer,
      profileImage: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`,
      favoriteEventIds: [],
      friendIds: [1, 2, 3], // Auto-friend primary users for social feature demonstration
      ticketIds: [],
      location: "Cluj-Napoca, Romania"
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('Home');
    setNavHistory(['Home']);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('Login');
    setNavHistory(['Login']);
    setNavigationPayload(null);
  };


  const toggleFavoriteEvent = (eventId: number) => {
    if (!currentUser) return;
    
    const isFav = currentUser.favoriteEventIds.includes(eventId);
    const updatedFavs = isFav
      ? currentUser.favoriteEventIds.filter(id => id !== eventId)
      : [...currentUser.favoriteEventIds, eventId];
      
    const updatedUser = { ...currentUser, favoriteEventIds: updatedFavs };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Also inject friendly activity if favorited
    if (!isFav) {
      const newActivity: FriendFeedActivity = {
        id: `ACT-${Date.now()}`,
        friendId: currentUser.id,
        friendName: currentUser.fullName,
        friendAvatar: currentUser.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.fullName}`,
        actionType: 'interested',
        eventName: events.find(e => e.id === eventId)?.name || 'an Event',
        eventId,
        timestamp: "Just now"
      };
      setFeedActivities(prev => [newActivity, ...prev]);
    }
  };

  const buyTicket = async (eventId: number, type: 'Standard' | 'VIP' | 'Premium', price: number): Promise<boolean> => {
    if (!currentUser) return false;

    let success = false;
    let eventName = '';
    let eventDate = '';
    let eventLoc = '';

    setEvents(prevEvents => {
      return prevEvents.map(evt => {
        if (evt.id === eventId) {
          const typeIndex = evt.ticketTypes.findIndex(t => t.type === type);
          if (typeIndex !== -1 && evt.ticketTypes[typeIndex].ticketsLeft > 0 && evt.ticketsLeft > 0) {
            success = true;
            eventName = evt.name;
            const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
            eventDate = new Date(evt.startDateTime).toLocaleDateString('en-US', options);
            eventLoc = evt.address;
            
            const updatedTypes = [...evt.ticketTypes];
            updatedTypes[typeIndex] = {
              ...updatedTypes[typeIndex],
              ticketsLeft: updatedTypes[typeIndex].ticketsLeft - 1
            };
            
            return {
              ...evt,
              ticketsLeft: evt.ticketsLeft - 1,
              ticketTypes: updatedTypes
            };
          }
        }
        return evt;
      });
    });

    // Wait a millisecond to allow state update to confirm success
    if (success) {
      const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: Ticket = {
        id: ticketId,
        eventId,
        eventName,
        eventDate,
        eventLocation: eventLoc,
        buyerName: currentUser.fullName,
        buyTime: new Date().toISOString(),
        price,
        qrCodeData: `${ticketId}-${eventId}-${type}-${currentUser.id}`,
        type
      };

      setTickets(prev => [...prev, newTicket]);
      
      const updatedUser = {
        ...currentUser,
        ticketIds: [...currentUser.ticketIds, ticketId]
      };
      
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

      // Inject social activity
      const newActivity: FriendFeedActivity = {
        id: `ACT-${Date.now()}`,
        friendId: currentUser.id,
        friendName: currentUser.fullName,
        friendAvatar: currentUser.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.fullName}`,
        actionType: 'going',
        eventName,
        eventId,
        timestamp: "Just now"
      };
      setFeedActivities(prev => [newActivity, ...prev]);

      return true;
    }

    return false;
  };

  const createEvent = (eventData: Omit<Event, 'id' | 'ticketsLeft' | 'score' | 'photos'> & { photos: string[] }) => {
    if (!currentUser) return;

    const newEvent: Event = {
      ...eventData,
      id: events.length + 1,
      ticketsLeft: eventData.capacity,
      score: 5.0,
      photos: eventData.photos.length > 0 ? eventData.photos : ["https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800"],
      ticketTypes: eventData.ticketTypes.map(t => ({ ...t, ticketsLeft: t.quantity }))
    };

    setEvents(prev => [newEvent, ...prev]);

    // Inject social activity
    const newActivity: FriendFeedActivity = {
      id: `ACT-${Date.now()}`,
      friendId: currentUser.id,
      friendName: currentUser.fullName,
      friendAvatar: currentUser.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.fullName}`,
      actionType: 'promoted',
      eventName: newEvent.name,
      eventId: newEvent.id,
      timestamp: "Just now"
    };
    setFeedActivities(prev => [newActivity, ...prev]);
  };

  const sendMessage = (recipientId: number, text: string) => {
    if (!currentUser) return;

    const newMsg: Message = {
      id: `MSG-${Date.now()}`,
      senderId: currentUser.id,
      recipientId,
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
  };

  const updateUserProfile = (fullName: string, email: string, profileImage?: string, location?: string) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      fullName,
      email,
      profileImage: profileImage || currentUser.profileImage,
      location: location || currentUser.location
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const toggleOrganizerMode = () => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      isOrganizer: !currentUser.isOrganizer
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      events,
      tickets,
      feedActivities,
      messages,
      currentPage,
      navigationPayload,
      navigate,
      goBack,
      login,
      register,
      logout,
      toggleFavoriteEvent,
      buyTicket,
      createEvent,
      sendMessage,
      updateUserProfile,
      toggleOrganizerMode
    }}>
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
