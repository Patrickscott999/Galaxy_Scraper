"use client";

import { ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise, hasStripeKey } from "@/lib/stripe";

interface StripeProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function StripeProvider({ children, fallback }: StripeProviderProps) {
  // If Stripe is not configured, show a placeholder or return the fallback
  if (!hasStripeKey || !stripePromise) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="p-4 border border-yellow-400 bg-yellow-50 rounded-md text-yellow-800">
        <p className="font-medium">Stripe is not configured</p>
        <p className="text-sm mt-1">Add your Stripe publishable key to the environment variables to enable payments.</p>
      </div>
    );
  }
  
  // If Stripe is configured, render the Elements provider
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
