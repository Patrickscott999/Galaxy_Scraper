"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { LogoutButton } from "@/components/auth/logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentForm } from "@/components/payment/payment-form";
import { StripeProvider } from "@/components/payment/stripe-provider";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  
  useEffect(() => {
    // If not loading and no user is found, redirect to login
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || "User");
      // Notify user when logged in successfully
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="text-center text-white">
          <h1 className="text-2xl font-semibold mb-4">Authentication Required</h1>
          <p className="mb-6">You need to log in to access this page</p>
          <Button asChild>
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-300 mt-1">
              <Link href="/" className="hover:underline">Home</Link> / Dashboard
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-white">Logged in as: {userName}</span>
            <LogoutButton variant="outline" />
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg mb-8">
          <div>
            <h2 className="text-xl font-semibold">Subscription</h2>
            <p className="text-gray-300 text-sm">Manage your subscription plans</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/subscriptions">Manage Subscription</Link>
          </Button>
        </div>
        
        <div className="flex items-center justify-between bg-purple-900/50 text-white p-4 rounded-lg mb-8">
          <div>
            <h2 className="text-xl font-semibold">Galaxy Scraper</h2>
            <p className="text-gray-300 text-sm">Use our AI-powered web scraping tool</p>
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/scraper">Launch Scraper</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {userName}!</CardTitle>
              <CardDescription>
                This is your personal dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your account is successfully set up.</p>
              <p className="mt-2">Email: {user.email}</p>
              
              {!isConfigured && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md">
                  <p className="text-sm font-medium">Development Mode</p>
                  <p className="text-sm">The app is running in development mode without Firebase credentials.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Test our Stripe integration</CardDescription>
            </CardHeader>
            <CardContent>
              <StripeProvider
                fallback={
                  <div className="text-center p-4">
                    <p className="mb-4">Stripe integration is not configured yet.</p>
                    <p className="text-sm text-gray-500">To enable payments, add your Stripe keys to the environment variables.</p>
                  </div>
                }
              >
                <PaymentForm 
                  amount={1999} 
                  description="Test Payment"
                  onSuccess={() => toast({
                    title: "Payment Successful",
                    description: "Your payment has been processed successfully.",
                  })}
                  onError={(error) => toast({
                    title: "Payment Failed",
                    description: error.message || "An error occurred during payment processing.",
                    variant: "destructive",
                  })}
                />
              </StripeProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
