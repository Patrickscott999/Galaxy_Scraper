"use client";

// Firebase configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Client-side only imports
let firebase: { app: FirebaseApp | null, auth: Auth | null, db: Firestore | null } = {
  app: null,
  auth: null,
  db: null
};

// Create a safe version of Firebase config that won't throw errors during SSR
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Check if we have the required Firebase credentials
const hasFirebaseCredentials = !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

// Only initialize Firebase in the browser
if (typeof window !== 'undefined') {
  // Initialize Firebase if it hasn't been initialized yet
  if (!getApps().length) {
    try {
      // Initialize Firebase
      firebase.app = initializeApp(firebaseConfig);
      firebase.auth = getAuth(firebase.app);
      firebase.db = getFirestore(firebase.app);
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      // Keep firebase objects as null
    }
  } else {
    // If Firebase is already initialized, use the existing instance
    const app = getApps()[0];
    firebase.app = app;
    firebase.auth = getAuth(app);
    firebase.db = getFirestore(app);
  }
}

// Export auth and db objects safely
export const auth = firebase.auth;
export const db = firebase.db;
export { hasFirebaseCredentials };

