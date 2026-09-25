import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { soundFx } from '../utils/sound';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  effectiveUserId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestId, setGuestId] = useState<string>(() => {
    const saved = localStorage.getItem('codepath_guest_uid');
    if (saved) return saved;
    const gen = 'guest_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('codepath_guest_uid', gen);
    return gen;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      soundFx.playClick();
      await signInWithPopup(auth, googleProvider);
      soundFx.playSuccess();
    } catch (err: unknown) {
      console.error('Google Sign-In failed:', err);
      // Fails gracefully
    }
  };

  const signOut = async () => {
    try {
      soundFx.playClick();
      await fbSignOut(auth);
    } catch (err) {
      console.error('Sign-Out failed:', err);
    }
  };

  const effectiveUserId = currentUser ? currentUser.uid : guestId;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signInWithGoogle,
        signOut,
        effectiveUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
