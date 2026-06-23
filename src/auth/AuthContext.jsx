import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Provides the current Firebase user and their role ('admin' | 'viewer')
// to the whole app. The role is read from the Firestore `roles/{uid}` doc,
// which is also what the security rules check — so the UI and the backend
// agree on permissions.
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
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'roles', u.uid));
          // Least privilege: anyone without an explicit role doc is a viewer.
          const resolved = snap.exists() ? (snap.data().role || 'viewer') : 'viewer';
          setRole(resolved);
          console.log(`[Auth] Signed in as ${u.email} — role: ${resolved}`);
        } catch (err) {
          console.error('[Auth] Failed to load role, defaulting to viewer:', err);
          setRole('viewer');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email.trim(), password);

  const logout = () => signOut(auth);

  const value = {
    user,
    role,
    isAdmin: role === 'admin',
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
