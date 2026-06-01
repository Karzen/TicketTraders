import { Event, User, FriendFeedActivity, Message } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    isOrganizer: false,
    fullName: "Alex Mercer",
    email: "alex@tickettraders.com",
    password: "password123",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    favoriteEventIds: [1, 3],
    friendIds: [2, 3, 4],
    ticketIds: ["TKT-1001"],
    location: "Cluj-Napoca, Romania"
  },
  {
    id: 2,
    isOrganizer: true,
    fullName: "Sarah Jenkins",
    email: "sarah.events@tickettraders.com",
    password: "password123",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    favoriteEventIds: [2],
    friendIds: [1, 3],
    ticketIds: [],
    location: "Cluj-Napoca, Romania"
  },
  {
    id: 3,
    isOrganizer: false,
    fullName: "Mihai Popescu",
    email: "mihai@gmail.com",
    password: "password123",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    favoriteEventIds: [1, 5],
    friendIds: [1, 2, 4],
    ticketIds: [],
    location: "Cluj-Napoca, Romania"
  },
  {
    id: 4,
    isOrganizer: false,
    fullName: "Elena Rostova",
    email: "elena@gmail.com",
    password: "password123",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    favoriteEventIds: [3, 4],
    friendIds: [1, 3],
    ticketIds: [],
    location: "Bucharest, Romania"
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    name: "Neon Horizon Music Festival",
    description: "Immerse yourself in a breathtaking 3-day audio-visual journey under the stars. Featuring the world's top electronic, synthwave, and indie pop producers, stunning 3D light installations, and multiple themed stages. Don't miss the ultimate neon night!",
    organizerName: "Sarah Jenkins (VividPulse Events)",
    address: "Polivalenta Arena Lawn, Cluj-Napoca",
    coordinates: { lat: 46.7679, lng: 23.5728 },
    startDateTime: "2026-07-15T18:00:00",
    endDateTime: "2026-07-17T23:59:00",
    tags: ["Music", "Festival", "Nightlife", "Synthwave"],
    capacity: 5000,
    ticketsLeft: 1243,
    sponsored: true,
    score: 4.9,
    ticketTypes: [
      { type: 'Standard', price: 150, quantity: 4000, ticketsLeft: 1040 },
      { type: 'VIP', price: 350, quantity: 800, ticketsLeft: 182 },
      { type: 'Premium', price: 600, quantity: 200, ticketsLeft: 21 }
    ],
    photos: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 2,
    name: "CodeCraft Hackathon & Tech Summit",
    description: "Build, learn, and network with 500+ builders worldwide. Engage in a 36-hour sprint creating decentralised, AI-integrated solutions for green logistics. Accompanied by tech lectures, expert panels, and direct investor matching.",
    organizerName: "TechHub Transylvania",
    address: "Vivid Incubator, Str. Memorandumului 10, Cluj-Napoca",
    coordinates: { lat: 46.7692, lng: 23.5857 },
    startDateTime: "2026-06-25T09:00:00",
    endDateTime: "2026-06-26T21:00:00",
    tags: ["Tech", "Education", "Conference", "AI"],
    capacity: 600,
    ticketsLeft: 89,
    sponsored: false,
    score: 4.8,
    ticketTypes: [
      { type: 'Standard', price: 0, quantity: 500, ticketsLeft: 74 },
      { type: 'VIP', price: 120, quantity: 100, ticketsLeft: 15 }
    ],
    photos: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 3,
    name: "Street Food & Jazz Boulevard",
    description: "A gorgeous culinary festival matching local artisan trucks with world-renowned jazz bands. Bring your friends to enjoy smoked brisket, fresh gelato, local craft beers, and smooth saxophone notes floating through the leafy Central Park.",
    organizerName: "Urban Vibes Association",
    address: "Central Park Entrance, Cluj-Napoca",
    coordinates: { lat: 46.7699, lng: 23.5794 },
    startDateTime: "2026-06-12T12:00:00",
    endDateTime: "2026-06-14T22:30:00",
    tags: ["Food", "Jazz", "Family", "Outdoor"],
    capacity: 10000,
    ticketsLeft: 4320,
    sponsored: true,
    score: 4.6,
    ticketTypes: [
      { type: 'Standard', price: 20, quantity: 8000, ticketsLeft: 3820 },
      { type: 'VIP', price: 80, quantity: 2000, ticketsLeft: 500 }
    ],
    photos: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1425934398684-25e219dc0e31?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 4,
    name: "Starlight Opera Gala",
    description: "Experience the magic of Mozart, Verdi, and Puccini under the stars. Performed by the National Opera House orchestra and award-winning international soloists in an unforgettable amphitheater atmosphere.",
    organizerName: "Cultura Transilvanica",
    address: "Alexandru Borza Botanical Garden Amphitheater, Cluj-Napoca",
    coordinates: { lat: 46.7624, lng: 23.5869 },
    startDateTime: "2026-08-01T20:30:00",
    endDateTime: "2026-08-01T23:30:00",
    tags: ["Theatre", "Classical", "Music", "DateNight"],
    capacity: 1200,
    ticketsLeft: 142,
    sponsored: false,
    score: 4.7,
    ticketTypes: [
      { type: 'Standard', price: 90, quantity: 800, ticketsLeft: 110 },
      { type: 'VIP', price: 200, quantity: 300, ticketsLeft: 30 },
      { type: 'Premium', price: 350, quantity: 100, ticketsLeft: 2 }
    ],
    photos: [
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 5,
    name: "Redline Drift Arena & Car Expo",
    description: "Smell the burnt rubber and hear the engines roar! The ultimate weekend for automotive enthusiasts. Featuring extreme drift battles by pro drivers, an expansive tuning car expo, performance hardware vendors, and stunt shows.",
    organizerName: "Redline Racing Club",
    address: "Expo Transilvania, Cluj-Napoca",
    coordinates: { lat: 46.7791, lng: 23.6212 },
    startDateTime: "2026-06-20T10:00:00",
    endDateTime: "2026-06-21T18:00:00",
    tags: ["Sports", "Adrenaline", "Motorsport", "Expo"],
    capacity: 3500,
    ticketsLeft: 840,
    sponsored: false,
    score: 4.5,
    ticketTypes: [
      { type: 'Standard', price: 45, quantity: 3000, ticketsLeft: 710 },
      { type: 'VIP', price: 150, quantity: 500, ticketsLeft: 130 }
    ],
    photos: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 6,
    name: "Secret Garden Rooftop Session",
    description: "An exclusive acoustic pop event overlooking the Cluj skyline. Unwind with artisanal signature cocktails, ambient deep house selectors, and a gorgeous sunset live performance by indie icon Chloe Miller.",
    organizerName: "Rooftop Cluj",
    address: "BT Tower Rooftop, Cluj-Napoca",
    coordinates: { lat: 46.7725, lng: 23.6062 },
    startDateTime: "2026-07-04T17:00:00",
    endDateTime: "2026-07-04T22:00:00",
    tags: ["Music", "Acoustic", "DateNight", "Exclusive"],
    capacity: 250,
    ticketsLeft: 18,
    sponsored: true,
    score: 4.8,
    ticketTypes: [
      { type: 'Standard', price: 80, quantity: 200, ticketsLeft: 12 },
      { type: 'VIP', price: 180, quantity: 50, ticketsLeft: 6 }
    ],
    photos: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

export const INITIAL_FEED_ACTIVITIES: FriendFeedActivity[] = [
  {
    id: "ACT-1",
    friendId: 2,
    friendName: "Sarah Jenkins",
    friendAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    actionType: "promoted",
    eventName: "Neon Horizon Music Festival",
    eventId: 1,
    timestamp: "2 hours ago"
  },
  {
    id: "ACT-2",
    friendId: 3,
    friendName: "Mihai Popescu",
    friendAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    actionType: "going",
    eventName: "Neon Horizon Music Festival",
    eventId: 1,
    timestamp: "4 hours ago"
  },
  {
    id: "ACT-3",
    friendId: 4,
    friendName: "Elena Rostova",
    friendAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    actionType: "interested",
    eventName: "Street Food & Jazz Boulevard",
    eventId: 3,
    timestamp: "1 day ago"
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "MSG-1",
    senderId: 3,
    recipientId: 1,
    text: "Hey Alex! Are you planning to go to the Neon Horizon festival this year?",
    timestamp: "2026-06-01T14:30:00"
  },
  {
    id: "MSG-2",
    senderId: 1,
    recipientId: 3,
    text: "Absolutely! I already bought my ticket. Standard tier is super cheap right now.",
    timestamp: "2026-06-01T14:32:00"
  },
  {
    id: "MSG-3",
    senderId: 3,
    recipientId: 1,
    text: "Awesome, let's grab some craft beers there. I'll get mine today!",
    timestamp: "2026-06-01T14:35:00"
  },
  {
    id: "MSG-4",
    senderId: 4,
    recipientId: 1,
    text: "Hi! Are you going to the Jazz festival? The food trucks look amazing.",
    timestamp: "2026-06-01T18:15:00"
  }
];
