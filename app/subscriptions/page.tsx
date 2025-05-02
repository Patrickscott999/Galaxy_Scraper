"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { PricingPlans } from "@/components/subscription/pricing-plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionStatus } from "@/components/subscription/subscription-status";
import { AlertTriangle } from "lucide-react";

export default function SubscriptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock customer ID for demo purposes - in a real app, you'd store this in your user database
  const [customerId, setCustomerId] = useState<string | null>(null);
  
  // Manage the free tier information
  const [isFreeTier, setIsFreeTier] = useState(false);
  const [freeTierData, setFreeTierData] = useState<any>(null);

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch the user's subscription data if they're logged in
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        // In a real app, you would retrieve the customerId from your database
        // For demo purposes, we'll use local storage to simulate persistence
        const storedCustomerId = localStorage.getItem('stripeCustomerId');
        const userPlan = localStorage.getItem('userPlan');
        
        // Check if user has a stored plan preference for free Basic tier
        if (userPlan === 'basic' || (!storedCustomerId && !userPlan)) {
          // If user has explicitly chosen basic plan or has no plan at all, default to free tier
          setIsFreeTier(true);
          setFreeTierData({
            planType: 'free',
            planName: 'Basic',
            activationDate: localStorage.getItem('planActivationDate') || new Date().toISOString(),
          });
          
          // If they don't have a plan saved yet, save the free tier
          if (!userPlan) {
            localStorage.setItem('userPlan', 'basic');
            localStorage.setItem('planActivationDate', new Date().toISOString());
          }
        }
        
        // Also check for paid subscriptions if they have a customer ID
        if (storedCustomerId) {
          setCustomerId(storedCustomerId);
          
          // Fetch subscription data
          const response = await fetch(`/api/get-subscription?customerId=${storedCustomerId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch subscription data');
          }
          
          const data = await response.json();
          if (data.subscriptions && data.subscriptions.length > 0) {
            // If they have an active paid subscription, use that instead of free tier
            const activeSubscription = data.subscriptions.find(
              (sub: any) => sub.status === 'active' || sub.status === 'trialing'
            );
            
            if (activeSubscription) {
              setSubscription(activeSubscription);
              setIsFreeTier(false); // No longer on free tier
              localStorage.setItem('userPlan', activeSubscription.items.data[0]?.price.product.name.toLowerCase() || 'paid');
            }
          }
        }
      } catch (err) {
        setError('Failed to load subscription information');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading || (!user && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
          <p className="text-gray-300 mt-1">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>{" "}
            / Subscriptions
          </p>
        </div>

        {/* Current Subscription Status */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>
              Manage your current subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading subscription information...</p>
            ) : error ? (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle size={18} />
                <p>{error}</p>
              </div>
            ) : subscription ? (
              <SubscriptionStatus subscription={subscription} />
            ) : isFreeTier && freeTierData ? (
              <SubscriptionStatus subscription={freeTierData} />
            ) : (
              <div>
                <p className="mb-4">You currently don't have an active subscription.</p>
                <Button asChild>
                  <a href="#pricing-plans">View Available Plans</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div id="pricing-plans">
          <PricingPlans />
        </div>
      </div>
    </div>
  );
}
