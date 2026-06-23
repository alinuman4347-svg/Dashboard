import { Loader2 } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import Login from './components/Login';
import Dashboard from './Dashboard';

export default function App() {
  const { user, loading } = useAuth();

  // While Firebase resolves the auth state, avoid flashing the login screen.
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-cyan-600 animate-spin" />
      </div>
    );
  }

  // Not signed in → login screen. Signed in → the full dashboard (which
  // adapts its controls to the user's role).
  return user ? <Dashboard /> : <Login />;
}
