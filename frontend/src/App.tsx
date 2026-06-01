import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationBar } from './components/NavigationBar';
import { Home } from './pages/Home';
import { EventDetails } from './pages/EventDetails';
import { EventTinder } from './pages/EventTinder';
import { Tickets } from './pages/Tickets';
import { Community } from './pages/Community';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const MainAppContent: React.FC = () => {
  const { currentPage, navigate } = useApp();

  // Expose global navigator so child elements can cross-trigger if necessary
  React.useEffect(() => {
    (window as any)._appContextNavigate = navigate;
    return () => {
      delete (window as any)._appContextNavigate;
    };
  }, [navigate]);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home />;
      case 'EventDetails':
        return <EventDetails />;
      case 'EventTinder':
        return <EventTinder />;
      case 'Tickets':
        return <Tickets />;
      case 'Community':
        return <Community />;
      case 'Settings':
        return <Settings />;
      case 'Login':
        return <Login />;
      case 'Register':
        return <Register />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="mobile-container min-h-screen bg-background flex flex-col shadow-elevation-3">
      {/* Top Application Headers (hides on Auth screens) */}
      <NavigationBar />
      
      {/* Scrollable Active Screen Content viewport */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {renderActivePage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#070709] w-full flex items-center justify-center p-0 md:p-4">
        {/* Render central responsive mobile safearea box */}
        <MainAppContent />
      </div>
    </AppProvider>
  );
}

export default App;
