// src/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,     // now loads correctly
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage }     from 'firebase/storage'; 

const firebaseConfig = {
  apiKey:            'AIzaSyA3qk9S-_BgvI2X2eo2ubZi4jS28y0vEvI',
  authDomain:        'elearning-app-afa29.firebaseapp.com',
  projectId:         'elearning-app-afa29',
  storageBucket:     'elearning-app-afa29.firebasestorage.app',
  messagingSenderId: '684104882986',
  appId:             '1:684104882986:web:4fc14ccf81c7b03e529c53',
  measurementId:     'G-88KJ0TSNCW',
};

const app  = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db   = getFirestore(app);
export const storage = getStorage(app);   // ← add & export