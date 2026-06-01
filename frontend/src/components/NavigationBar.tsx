import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Flame, Ticket, Users, User, ArrowLeft, LogOut, ShieldAlert } from 'lucide-react';
import { Ripple } from './Ripple';

export const NavigationBar: React.FC = () => {
  const { currentPage, navigate, goBack, currentUser, logout } = useApp();

  // Bottom navigation tab mappings
  const tabs = [
    { name: 'Home', icon: Home, label: 'Explore' },
    { name: 'EventTinder', icon: Flame, label: 'Tinder' },
    { name: 'Tickets', icon: Ticket, label: 'Tickets' },
    { name: 'Community', icon: Users, label: 'Community' },
    { name: 'Settings', icon: User, label: 'Profile' }
  ];

  const handleTabClick = (tabName: string) => {
    if (currentPage !== tabName) {
      navigate(tabName);
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'Home': return 'TicketTraders';
      case 'EventTinder': return 'Match Events';
      case 'Tickets': return 'My Tickets & Favs';
      case 'Community': return 'Community';
      case 'Settings': return 'Settings & Profile';
      case 'EventDetails': return 'Event Details';
      default: return 'TicketTraders';
    }
  };

  const showBackButton = ['EventDetails'].includes(currentPage);
  const showTopBar = !['Login', 'Register'].includes(currentPage);
  const showBottomBar = !['Login', 'Register', 'EventDetails'].includes(currentPage);

  if (!showTopBar) return null;

  return (
    <>
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full h-16 bg-surface/95 backdrop-blur-md border-b border-surface-outline px-4 flex items-center justify-between glass">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <button 
              onClick={goBack}
              className="p-2 -ml-2 rounded-full text-textColor-secondary hover:text-textColor-primary hover:bg-surface-variant transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white shadow-elevation-1">
              TT
            </div>
          )}
          <span className="text-xl font-bold tracking-tight text-textColor-primary">
            {getPageTitle()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.isOrganizer && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
              Organizer Mode
            </span>
          )}
          {currentUser ? (
            <Ripple 
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/40 focus:outline-none"
              onClick={() => navigate('Settings')}
            >
              <img 
                src={currentUser.profileImage} 
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            </Ripple>
          ) : null}
        </div>
      </header>

      {/* Bottom M3 Navigation Bar */}
      {showBottomBar && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-40 h-20 bg-surface/95 backdrop-blur-md border-t border-surface-outline px-2 flex items-center justify-around pb-safe glass">

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPage === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.name)}
                className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center relative focus:outline-none"
              >
                {/* Active Pill Container */}
                <div 
                  className={`relative flex items-center justify-center w-16 h-8 rounded-m3-full mb-1 transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/20 text-primary scale-110 shadow-sm' 
                      : 'text-textColor-secondary hover:text-textColor-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-105 stroke-[2.5px]' : 'stroke-[2px]'}`} />
                </div>
                {/* Tab Label */}
                <span 
                  className={`text-xs tracking-wider transition-all duration-300 ${
                    isActive 
                      ? 'text-primary font-bold scale-105' 
                      : 'text-textColor-secondary font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
};
