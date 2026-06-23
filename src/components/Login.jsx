import { useState } from 'react';
import { LogIn, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

// Friendly messages for the common Firebase Auth error codes.
function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-email':       return 'That email address looks invalid.';
    case 'auth/user-disabled':       return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':  return 'Incorrect email or password.';
    case 'auth/too-many-requests':   return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default:                         return 'Could not sign in. Please try again.';
  }
}

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      // On success, onAuthStateChanged swaps this screen for the dashboard.
    } catch (err) {
      console.error('[Auth] Login failed:', err);
      setError(friendlyError(err?.code));
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          </div>
          <h1 className="mt-3 text-xl font-bold text-gray-800">Andrew Team Dashboard</h1>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
          >
            {busy
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              : <><LogIn className="w-4 h-4" /> Sign In</>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Access is role-based. Contact your admin if you can't sign in.
        </p>
      </div>
    </div>
  );
}
