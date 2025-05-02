import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');
    const subscriptionId = url.searchParams.get('subscriptionId');

    if (!customerId && !subscriptionId) {
      return NextResponse.json(
        { error: 'Customer ID or Subscription ID is required' },
        { status: 400 }
      );
    }

    let subscription;

    if (subscriptionId) {
      // If we have a subscription ID, retrieve that specific subscription
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } else if (customerId) {
      // Otherwise, list all subscriptions for the customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 10,
        status: 'all',
      });
      
      return NextResponse.json({ 
        subscriptions: subscriptions.data 
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to retrieve subscription' },
      { status: 500 }
    );
  }
}
