import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';
import { Ripple } from '../components/Ripple';

export const Login: React.FC = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate short network latency
    setTimeout(async () => {
      const success = await login(email, password);
      setLoading(false);
      if (!success) {
        setError('Invalid email or password.');
      }
    }, 800);
  };

  const autofillDemo = (type: 'user' | 'organizer') => {
    if (type === 'user') {
      setEmail('alex@tickettraders.com');
      setPassword('password123');
    } else {
      setEmail('sarah.events@tickettraders.com');
      setPassword('password123');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-background relative overflow-hidden">
      {/* Blurred decorative glowing background nodes */}
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[80px]" />

      <div className="z-10 w-full max-w-sm mx-auto flex flex-col gap-8">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-black text-2xl text-white shadow-elevation-2 animate-bounce">
            TT
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-textColor-primary">
              TicketTraders
            </h1>
            <p className="text-xs text-textColor-secondary mt-1">
              The premier marketplace to buy, trade, and promote local events
            </p>
          </div>
        </div>

        {/* Auth Box */}
        <div className="glass rounded-m3-xl p-6 border border-surface-outline/50 shadow-elevation-2 flex flex-col gap-5">
          <h2 className="text-lg font-bold text-textColor-primary flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            <span>Welcome Back</span>
          </h2>

          {error && (
            <div className="p-3.5 rounded-m3-md bg-tertiary/10 border border-tertiary/20 text-xs text-tertiary flex items-start gap-2 animate-pulse">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-textColor-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textColor-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 pl-10 pr-4 rounded-m3-md bg-surface border border-surface-outline focus:outline-none focus:border-primary text-textColor-primary text-sm transition-colors"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-textColor-secondary uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textColor-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-4 rounded-m3-md bg-surface border border-surface-outline focus:outline-none focus:border-primary text-textColor-primary text-sm transition-colors"
                />
              </div>
            </div>

            <Ripple className="mt-2 rounded-m3-md overflow-hidden">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-100 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </Ripple>
          </form>

          {/* Quick Demo Login Auto-fillers */}
          <div className="flex flex-col gap-2 pt-2 border-t border-surface-outline/50">
            <span className="text-[9px] font-bold text-textColor-secondary uppercase tracking-widest text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-secondary" />
              <span>Autofill Demo Profiles</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => autofillDemo('user')}
                className="flex-1 h-9 rounded-m3-md border border-surface-outline/80 bg-surface-variant/40 hover:bg-surface-variant text-[10px] font-semibold text-textColor-secondary hover:text-textColor-primary transition-all"
              >
                Alex (Attender)
              </button>
              <button
                type="button"
                onClick={() => autofillDemo('organizer')}
                className="flex-1 h-9 rounded-m3-md border border-surface-outline/80 bg-surface-variant/40 hover:bg-surface-variant text-[10px] font-semibold text-textColor-secondary hover:text-textColor-primary transition-all"
              >
                Sarah (Organizer)
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Link to Signup */}
        <p className="text-center text-xs text-textColor-secondary">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('Register')}
            className="text-primary font-bold hover:underline focus:outline-none"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};
