import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import { Ripple } from '../components/Ripple';

export const Register: React.FC = () => {
  const { register, navigate } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate short network latency
    setTimeout(async () => {
      const success = await register(fullName, email, password, isOrganizer);
      setLoading(false);
      if (!success) {
        setError('This email is already registered.');
      }
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-10 bg-background relative overflow-hidden">
      {/* Blurred decorative glowing background nodes */}
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[80px]" />

      <div className="z-10 w-full max-w-sm mx-auto flex flex-col gap-6">
        {/* Navigation back */}
        <button
          onClick={() => navigate('Login')}
          className="flex items-center gap-1.5 text-xs text-textColor-secondary hover:text-textColor-primary transition-colors focus:outline-none -ml-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>

        {/* Branding header */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <h1 className="text-2xl font-black tracking-tight text-textColor-primary">
            Create Account
          </h1>
          <p className="text-xs text-textColor-secondary">
            Join TicketTraders to explore, buy tickets, and build communities
          </p>
        </div>

        {/* Auth Box */}
        <div className="glass rounded-m3-xl p-6 border border-surface-outline/50 shadow-elevation-2 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-m3-md bg-tertiary/10 border border-tertiary/20 text-xs text-tertiary flex items-start gap-2 animate-pulse">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Fullname field */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-secondary" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-11 pl-9 pr-4 rounded-m3-md bg-surface border border-surface-outline focus:outline-none focus:border-primary text-textColor-primary text-sm transition-colors"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-9 pr-4 rounded-m3-md bg-surface border border-surface-outline focus:outline-none focus:border-primary text-textColor-primary text-sm transition-colors"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textColor-secondary uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-11 pl-9 pr-4 rounded-m3-md bg-surface border border-surface-outline focus:outline-none focus:border-primary text-textColor-primary text-sm transition-colors"
                />
              </div>
            </div>

            {/* M3 Toggle Switch for Organizer Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-m3-md bg-surface-variant/30 border border-surface-outline/50 my-1">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-textColor-primary">Promoter / Organizer</span>
                <span className="text-[9px] text-textColor-secondary">I want to create & publish events</span>
              </div>
              
              <button
                type="button"
                onClick={() => setIsOrganizer(!isOrganizer)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                  isOrganizer ? 'bg-primary' : 'bg-surface-outline'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                    isOrganizer ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <Ripple className="mt-2 rounded-m3-md overflow-hidden">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-100 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </Ripple>
          </form>
        </div>

        {/* Footer Link back */}
        <p className="text-center text-xs text-textColor-secondary">
          Already have an account?{' '}
          <button
            onClick={() => navigate('Login')}
            className="text-primary font-bold hover:underline focus:outline-none"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
