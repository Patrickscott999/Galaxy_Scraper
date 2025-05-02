import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Use the latest API version available
});

export async function POST(request: Request) {
  try {
    const { amount, description, userId } = await request.json();

    // Validate the request
    if (!amount || amount < 50) { // Minimum amount is 50 cents (Stripe requirement)
      return NextResponse.json(
        { error: 'Invalid amount, minimum is $0.50' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description,
      metadata: {
        userId,
      },
    });

    // Return the client secret to the client
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
