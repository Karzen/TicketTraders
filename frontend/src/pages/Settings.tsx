import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Settings as SettingsIcon, LogOut, ShieldAlert, Sparkles, Plus, Image, Calendar, MapPin, Tag, RefreshCw } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { Ripple } from '../components/Ripple';

export const Settings: React.FC = () => {
  const { currentUser, updateUserProfile, toggleOrganizerMode, createEvent, logout, navigate } = useApp();
  
  // Organizer Form State
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [capacity, setCapacity] = useState('100');
  const [priceStandard, setPriceStandard] = useState('20');
  const [priceVIP, setPriceVIP] = useState('60');

  // Account details state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || '');
  const [profileStatus, setProfileStatus] = useState<'idle' | 'success'>('idle');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(fullName, email, profileImage, currentUser?.location);
    setProfileStatus('success');
    setTimeout(() => setProfileStatus('idle'), 2000);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !address || !startDateTime || !endDateTime) {
      alert('Please fill in required fields.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const cap = parseInt(capacity) || 100;
    const stdPrice = parseFloat(priceStandard) || 0;
    const vipPrice = parseFloat(priceVIP) || 0;

    createEvent({
      name,
      description,
      organizerName: currentUser?.fullName || 'Organizer',
      address,
      coordinates: { lat: 46.77 + (Math.random() - 0.5) * 0.02, lng: 23.59 + (Math.random() - 0.5) * 0.02 },
      startDateTime,
      endDateTime,
      tags: tags.length > 0 ? tags : ['Local', 'Event'],
      capacity: cap,
      sponsored: false,
      ticketTypes: [
        { type: 'Standard', price: stdPrice, quantity: Math.round(cap * 0.8), ticketsLeft: Math.round(cap * 0.8) },
        { type: 'VIP', price: vipPrice, quantity: Math.round(cap * 0.2), ticketsLeft: Math.round(cap * 0.2) }
      ],
      photos: ["https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800"]
    });

    // Reset fields & close drawer
    setName('');
    setDescription('');
    setAddress('');
    setStartDateTime('');
    setEndDateTime('');
    setTagsInput('');
    setCapacity('100');
    setPriceStandard('20');
    setPriceVIP('60');
    setIsCreateSheetOpen(false);

    // Navigate to Explore
    navigate('Home');
  };

  const handleFactoryReset = () => {
    if (window.confirm('Reset local database back to default profiles & events? This will delete all customized tickets.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-24 bg-background relative overflow-hidden fade-in">
      {/* Decorative gradient overlay */}
      <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Screen Header */}
      <div className="shrink-0 flex items-center gap-1.5 mb-5 relative z-10">
        <SettingsIcon className="w-5 h-5 text-textColor-secondary" />
        <h2 className="text-base font-extrabold text-textColor-primary">
          Settings & Account
        </h2>
      </div>

      {/* Profile Form box */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5 relative z-10">
        <form onSubmit={handleUpdateProfile} className="glass rounded-m3-lg p-5 border border-surface-outline flex flex-col gap-4 shadow-sm">
          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">
            Personal Information
          </h3>

          <div className="flex gap-4 items-center mb-1">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-surface-variant flex items-center justify-center">
              <img src={profileImage || 'https://api.dicebear.com/7.x/adventurer/svg?seed=TicketTraders'} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Profile Picture Seed</span>
              <input
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="Image Seed URL"
                className="w-full h-8 px-2.5 rounded bg-surface border border-surface-outline text-textColor-primary text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-textColor-secondary uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-10 px-3 rounded bg-surface border border-surface-outline text-textColor-primary text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-textColor-secondary uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded bg-surface border border-surface-outline text-textColor-primary text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <Ripple className="rounded-m3-md overflow-hidden">
            <button
              type="submit"
              className="w-full h-10 bg-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center"
            >
              {profileStatus === 'success' ? 'Profile Saved! ✓' : 'Save Profiles Info'}
            </button>
          </Ripple>
        </form>

        {/* Dynamic organizer console triggers */}
        <div className="glass rounded-m3-lg p-5 border border-surface-outline flex flex-col gap-4 shadow-sm">
          <h3 className="text-xs font-extrabold text-secondary uppercase tracking-wider">
            Promoter Dashboard
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-m3-md bg-surface-variant/40 border border-surface-outline/50">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-textColor-primary">Event Organizer Mode</span>
              <span className="text-[9px] text-textColor-secondary">Enable event creation and ticket promotion</span>
            </div>
            
            <button
              onClick={toggleOrganizerMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentUser?.isOrganizer ? 'bg-secondary' : 'bg-surface-outline'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  currentUser?.isOrganizer ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {currentUser?.isOrganizer && (
            <Ripple className="rounded-m3-md overflow-hidden">
              <button
                onClick={() => setIsCreateSheetOpen(true)}
                className="w-full h-11 bg-secondary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Plus className="w-5 h-5" />
                <span>Create & Publish Event</span>
              </button>
            </Ripple>
          )}
        </div>

        {/* Global Utilities Box */}
        <div className="glass rounded-m3-lg p-5 border border-surface-outline flex flex-col gap-3.5 shadow-sm mb-4">
          <h3 className="text-xs font-extrabold text-tertiary uppercase tracking-wider">
            Developer Console & Utilities
          </h3>
          
          <button
            onClick={handleFactoryReset}
            className="w-full h-10 border border-surface-outline hover:border-tertiary/60 bg-surface text-textColor-primary hover:text-tertiary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-m3-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Local Storage Db</span>
          </button>
          
          <Ripple className="rounded-m3-md overflow-hidden">
            <button
              onClick={logout}
              className="w-full h-10 bg-tertiary/20 text-tertiary border border-tertiary/30 hover:bg-tertiary hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </Ripple>
        </div>
      </div>

      {/* EVENT CREATION BOTTOM SHEET (ORGANIZERS ONLY) */}
      <BottomSheet
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        title="Publish New Event"
        maxHeight="max-h-[92vh]"
      >
        <form onSubmit={handleCreateEvent} className="flex flex-col gap-4 text-textColor-primary text-xs pb-10">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Event Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Neon Rooftop Session"
              required
              className="w-full h-10 px-3 rounded bg-surface border border-surface-outline focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide event details, special guests, performance bounds..."
              rows={3}
              required
              className="w-full p-3 rounded bg-surface border border-surface-outline focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Venue Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-secondary" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Str. Memorandumului 10, Cluj-Napoca"
                required
                className="w-full h-10 pl-9 pr-4 rounded bg-surface border border-surface-outline focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Start Time *</span>
              </label>
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
                className="w-full h-10 px-3 rounded bg-surface border border-surface-outline text-textColor-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>End Time *</span>
              </label>
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                required
                className="w-full h-10 px-3 rounded bg-surface border border-surface-outline text-textColor-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full h-10 px-3 rounded bg-surface border border-surface-outline"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Std. Price ($)</label>
              <input
                type="number"
                value={priceStandard}
                onChange={(e) => setPriceStandard(e.target.value)}
                className="w-full h-10 px-3 rounded bg-surface border border-surface-outline"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">VIP Price ($)</label>
              <input
                type="number"
                value={priceVIP}
                onChange={(e) => setPriceVIP(e.target.value)}
                className="w-full h-10 px-3 rounded bg-surface border border-surface-outline"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-secondary" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Music, Festival, Techno"
              className="w-full h-10 px-3 rounded bg-surface border border-surface-outline focus:outline-none"
            />
          </div>

          <Ripple className="mt-3 rounded-m3-md overflow-hidden">
            <button
              type="submit"
              className="w-full h-12 bg-secondary text-white font-bold uppercase tracking-wider flex items-center justify-center"
            >
              Publish & Promote Event
            </button>
          </Ripple>
        </form>
      </BottomSheet>
    </div>
  );
};
