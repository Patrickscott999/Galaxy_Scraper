"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { StripeProvider } from "@/components/payment/stripe-provider";

interface Plan {
  name: string;
  description: string;
  price: string;
  priceId: string;
  features: string[];
  recommended: boolean;
  isFree?: boolean;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  userId: string;
}

function SubscriptionForm({ plan, userId, onSuccess, onClose }: { plan: Plan; userId: string; onSuccess: () => void; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Call your backend to create the subscription
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create subscription");
      }

      const { clientSecret, subscriptionId, customerId } = await response.json();

      // Complete the subscription with card details
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Confirm the subscription payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Save the customerId and subscriptionId to your database (you would implement this)
      // For example with Firebase:
      // await updateDoc(doc(db, "users", userId), {
      //   stripeCustomerId: customerId,
      //   stripeSubscriptionId: subscriptionId,
      //   subscriptionStatus: "active",
      //   subscriptionPlan: plan.name,
      //   subscriptionPriceId: plan.priceId
      // });

      toast({
        title: "Subscription successful",
        description: `You are now subscribed to the ${plan.name} plan!`,
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <h3 className="font-medium mb-2">Subscription Details</h3>
        <p>Plan: <strong>{plan.name}</strong></p>
        <p>Price: <strong>{plan.price}{!plan.isFree ? '/month' : ''}</strong></p>
        
        {localStorage.getItem('userPlan') === 'basic' && (
          <div className="mt-2 p-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-sm">
            <p>You're upgrading from the <strong>Free Basic</strong> plan</p>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Payment Method</h3>
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
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={processing || !stripe}>
          {processing ? "Processing..." : "Subscribe Now"}
        </Button>
      </div>
    </form>
  );
}

export function SubscriptionModal({ isOpen, onClose, plan, userId }: SubscriptionModalProps) {
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name} Plan</DialogTitle>
          <DialogDescription>
            Enter your payment details to complete your subscription
          </DialogDescription>
        </DialogHeader>
        
        <StripeProvider>
          <SubscriptionForm 
            plan={plan} 
            userId={userId} 
            onSuccess={handleSuccess} 
            onClose={handleClose} 
          />
        </StripeProvider>
      </DialogContent>
    </Dialog>
  );
}
