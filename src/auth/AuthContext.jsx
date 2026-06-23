import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, signInAnonymously, signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

// Admin is determined by email. Anyone signed in with one of these emails is
// an admin; everyone else (including anonymous "View Dashboard" guests) is a
// read-only viewer. The SAME list is enforced in the Firestore security rules,
// so the UI and the backend agree — and a viewer can't write even via devtools.
const ADMIN_EMAILS = ['numan.ali@symufolk.com'];

function roleForUser(u) {
  if (!u || u.isAnonymous) return 'viewer';
  const email = (u.email || '').toLowerCase();
  return ADMIN_EMAILS.includes(email) ? 'admin' : 'viewer';
}

// Provides the current Firebase user and their role ('admin' | 'viewer').
const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const resolved = roleForUser(u);
        setRole(resolved);
        console.log(`[Auth] Signed in as ${u.isAnonymous ? 'guest' : u.email} — role: ${resolved}`);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email.trim(), password);

  // Guest / Viewer access — no credentials. A guest is signed in anonymously,
  // has no role doc, and so resolves to 'viewer' (read-only). The Firestore
  // rules still block all writes for this session on the backend.
  const loginAsGuest = () => signInAnonymously(auth);

  const logout = () => signOut(auth);

  const value = {
    user,
    role,
    isAdmin: role === 'admin',
    loading,
    login,
    loginAsGuest,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
