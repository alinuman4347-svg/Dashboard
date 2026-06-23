// Firebase initialization + Firestore export.
//
// Config is read from Vite env vars (see .env.local). This keeps your secret
// keys out of source control. If a value is missing the app still boots, but
// Firestore calls will fail — check the console for "[Firebase]" messages.
//
// getApps()/getApp() guard prevents the "Firebase App named '[DEFAULT]'
// already exists" duplicate-initialization error during Vite HMR.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.warn(
    '[Firebase] Missing config — create a .env.local file with your ' +
    'VITE_FIREBASE_* values, then restart `npm run dev`.'
  );
}

// Reuse the existing app instance if one was already created (HMR-safe).
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;
