"use client";

import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key safely
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Check if Stripe publishable key is available and valid
const hasStripeKey = !!stripePublishableKey && stripePublishableKey.startsWith('pk_');

// Stripe client promise that's initialized only on the client side
let stripePromise: Promise<any> | null = null;

// Only initialize Stripe in browser environment
if (typeof window !== 'undefined' && hasStripeKey) {
  try {
    stripePromise = loadStripe(stripePublishableKey);
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    stripePromise = null;
  }
}

export { stripePromise, hasStripeKey };
