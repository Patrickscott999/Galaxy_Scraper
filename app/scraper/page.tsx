"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GalaxyScraper } from "@/components/galaxy-scraper";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

export default function ScraperPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  
  // Function to toggle dev mode for testing
  const toggleDevMode = () => {
    const newDevModeState = !devModeEnabled;
    setDevModeEnabled(newDevModeState);
    localStorage.setItem('devModeEnabled', newDevModeState.toString());
  };
  
  // Enable development mode bypass for testing
  useEffect(() => {
    // Check if we're in development environment
    if (process.env.NODE_ENV === 'development') {
      // Store the override in localStorage for persistence
      const storedDevMode = localStorage.getItem('devModeEnabled');
      setDevModeEnabled(storedDevMode === 'true');
    }
  }, []);
  
  useEffect(() => {
    // Only redirect if not in dev mode and not authenticated
    if (!loading && !user && !devModeEnabled) {
      router.push("/auth/login");
    }
  }, [user, loading, router, devModeEnabled]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!user && !devModeEnabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Authentication Required</h1>
          <p className="text-gray-300 mb-6">You need to be logged in to access the Galaxy Scraper.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>
          
          {/* Development mode button - only visible in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 pt-4 border-t border-slate-700">
              <p className="text-amber-400 text-sm mb-2">Developer Testing Mode</p>
              <Button 
                variant="outline" 
                onClick={toggleDevMode}
                className="bg-slate-800 text-amber-400 border-amber-500/50 hover:bg-amber-900/30"
              >
                Enable Dev Mode (Skip Auth)
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Galaxy Scraper</h1>
            <p className="text-gray-300 mt-1">
              <Link href="/dashboard" className="hover:underline">Dashboard</Link> / Scraper
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Button asChild variant="outline">
              <Link href="/subscriptions">Manage Subscription</Link>
            </Button>
            <LogoutButton variant="outline" />
          </div>
        </div>
        
        <GalaxyScraper />
      </div>
    </div>
  );
}
