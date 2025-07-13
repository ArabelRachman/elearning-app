// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

import * as SecureStore from 'expo-secure-store';
import { auth, db } from '@/src/firebase';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type AuthValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  signup: (e: string, p: string, role: 'student' | 'instructor') => Promise<void>;
  loginStudent:  (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
  loginInstructor:  (e: string, p: string) => Promise<void>;
};

/* ------------------------------------------------------------------ */
/*  Context helpers                                                    */
/* ------------------------------------------------------------------ */
export const AuthContext = createContext<AuthValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within <AuthProvider>');
  return ctx;
};

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser]         = useState<User | null>(null);

  /* 🔄  keep session in sync */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  /* ✚  Sign-up helper */
  const signup = async (
    email: string,
    pass: string,
    role: 'student' | 'instructor',
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);

    // create profile document
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      role,
      createdAt: Date.now(),
    });

    // optional: keep ID-token for your backend
    const token = await cred.user.getIdToken();
    await SecureStore.setItemAsync('fb_token', token);
  };

  /* 🔑  loginStudent helper (students only) */
  const loginStudent = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);

    // fetch profile & role
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    const role = snap.data()?.role;

    if (role !== 'student') {
      await signOut(auth); // prevent stray session
      throw new Error('Only student accounts can log in on this app.');
    }

    const token = await cred.user.getIdToken();
    await SecureStore.setItemAsync('fb_token', token);
  };

    /* 🔑  loginStudent helper (students only) */
  const loginInstructor = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);

    // fetch profile & role
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    const role = snap.data()?.role;

    if (role !== 'instructor') {
      await signOut(auth); // prevent stray session
      throw new Error('Only student accounts can log in on this app.');
    }

    const token = await cred.user.getIdToken();
    await SecureStore.setItemAsync('fb_token', token);
  };

  /* ↩︎  Logout helper */
  const logout = async () => {
    await SecureStore.deleteItemAsync('fb_token');
    await signOut(auth);
  };

  /* 📦  provide API */
  const value: AuthValue = {
    isLoading,
    isAuthenticated: !!user,
    user,
    signup,
    loginStudent,
    logout,
    loginInstructor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
