import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/lib/firebase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(request: Request) {
  try {
    const { priceId, customerId, userId } = await request.json();

    // Validate the request
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let customer;
    
    // If we have a customerId, use it; otherwise create a new customer
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else {
      // Get the current user from Firebase Auth
      const firebaseUser = auth?.currentUser;
      
      if (!firebaseUser && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // Using mock user in development mode
        customer = await stripe.customers.create({
          email: 'test@example.com',
          name: 'Test User',
          metadata: {
            userId: userId,
          },
        });
      } else if (firebaseUser) {
        // Create a new customer with the Firebase user's email
        customer = await stripe.customers.create({
          email: firebaseUser.email || undefined,
          name: firebaseUser.displayName || undefined,
          metadata: {
            userId: userId,
          },
        });
      } else {
        return NextResponse.json(
          { error: 'User is not authenticated' },
          { status: 401 }
        );
      }
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Return the client secret for the subscription
    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
