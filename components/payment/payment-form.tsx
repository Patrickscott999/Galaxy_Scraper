"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/authContext";

interface PaymentFormProps {
  amount: number; // Amount in cents
  description: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentForm({ amount, description, onSuccess, onError }: PaymentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (!user) {
      setError("You must be logged in to make a payment");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create a payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          description,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const data = await response.json();
      const clientSecret = data.clientSecret;

      // Complete payment with card details
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user.email || undefined,
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      } else if (paymentResult.paymentIntent?.status === "succeeded") {
        setSucceeded(true);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        if (onError) onError(err);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          {description} - ${(amount / 100).toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {succeeded && (
            <Alert>
              <AlertDescription>Payment successful!</AlertDescription>
            </Alert>
          )}
          <div className="p-3 border rounded-md">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={processing || succeeded || !stripe || !elements}
          >
            {processing ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
