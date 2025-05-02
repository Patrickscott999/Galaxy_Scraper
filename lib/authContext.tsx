"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, hasFirebaseCredentials } from './firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  isConfigured: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Make sure we consider Firebase to be configured only if auth object exists
  const isConfigured = hasFirebaseCredentials && !!auth;

  useEffect(() => {
    // If we're on the server or Firebase is not configured, return early
    if (typeof window === 'undefined' || !isConfigured || !auth) {
      setLoading(false);
      return () => {};
    }
    
    try {
      console.log('Setting up auth state listener');
      // If Firebase is configured and auth exists, use its auth state
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'No user');
        setUser(user);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      setLoading(false);
      return () => {};
    }
  }, [isConfigured]);
  
  // Load mock user from localStorage if Firebase is not configured
  useEffect(() => {
    if (!isConfigured && typeof window !== 'undefined') {
      console.log('Using mock authentication');
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser) as any);
      }
      setLoading(false);
    }
  }, [isConfigured]);

  // Sign up function
  const signup = async (email: string, password: string) => {
    if (!isConfigured) {
      console.log("Firebase not configured. Using mock implementation.");
      // Create a mock user for development
      const mockUser = { 
        uid: "mock-uid-" + Math.random().toString(36).substr(2, 9), 
        email, 
        displayName: email.split('@')[0],
        emailVerified: false
      };
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        // Store user credentials in localStorage
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.setItem('mockPassword', password);
        
        // Update auth state
        setUser(mockUser as any);
      }
      
      return mockUser;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Log in function
  const login = async (email: string, password: string) => {
    if (!isConfigured) {
      console.log("Firebase not configured. Using mock implementation.");
      
      // Check if we have stored credentials in localStorage
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('mockUser');
        const storedPassword = localStorage.getItem('mockPassword');
        
        if (storedUser) {
          const mockUser = JSON.parse(storedUser);
          
          // Verify the email and password
          if (mockUser.email === email && storedPassword === password) {
            // Set the user in state
            setUser(mockUser as any);
            return mockUser;
          } else {
            throw new Error('Invalid email or password');
          }
        } else {
          throw new Error('User not found');
        }
      }
      
      // Fallback if localStorage is not available
      const mockUser = { uid: "mock-uid", email, displayName: email.split('@')[0] };
      setUser(mockUser as any);
      return mockUser;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Log out function
  const logout = async () => {
    if (!isConfigured) {
      console.log("Firebase not configured. Using mock implementation.");
      // Clean up localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mockUser');
        localStorage.removeItem('mockPassword');
      }
      setUser(null);
      return;
    }
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      console.log("Firebase not configured. Using mock implementation.");
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!isConfigured) {
      console.log("Firebase not configured. Using mock implementation.");
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, displayName } as User;
      });
      return;
    }
    
    try {
      if (!auth.currentUser) throw new Error("No user is currently signed in");
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || null
      });
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    isConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
