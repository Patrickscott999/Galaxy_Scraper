"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SubscriptionStatusProps {
  subscription: any; // Full Stripe subscription object
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  // Special case for free plan - when this is passed directly instead of a Stripe subscription
  const isFreeBasicPlan = subscription?.planType === 'free' && subscription?.planName === 'Basic';
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle display values based on plan type (free or paid)
  let status, planName, amount, currency, currentPeriodEnd, startDate;
  
  if (isFreeBasicPlan) {
    // Values for free Basic plan
    status = 'Active';
    planName = 'Basic';
    amount = '0.00';
    currency = 'USD';
    
    // For free plan, we might not have period dates from Stripe, so use activation date
    const activationDate = subscription.activationDate || new Date().toISOString();
    startDate = new Date(activationDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    currentPeriodEnd = 'Never (Free plan)';
  } else {
    // Format the subscription status for paid plans
    status = subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
    
    // Get the plan name from Stripe metadata or item name
    planName = subscription.items.data[0]?.price.product.name || "Subscription";
    
    // Format the price amount
    amount = (subscription.items.data[0]?.price.unit_amount / 100).toFixed(2);
    currency = subscription.items.data[0]?.price.currency.toUpperCase();
    
    // Format dates
    const formatDate = (timestamp: number) => {
      return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };
    
    currentPeriodEnd = formatDate(subscription.current_period_end);
    startDate = formatDate(subscription.start_date);
  }

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, you would call an API endpoint to cancel the subscription
      // For example:
      // const response = await fetch(`/api/cancel-subscription?subscriptionId=${subscription.id}`, {
      //   method: 'POST',
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to cancel subscription');
      // }
      
      // For demo purposes, we'll just show a success message
      toast({
        title: "Subscription canceled",
        description: "Your subscription will end at the current billing period.",
      });
      
      setCancelDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subscription upgrade/downgrade
  const handleUpdateSubscription = () => {
    // In a real implementation, you would redirect to a page to select a new plan
    // For demo purposes, we'll just scroll to the pricing plans section
    document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle reactivating a canceled subscription
  const handleReactivateSubscription = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, you would call an API endpoint to reactivate the subscription
      // For example:
      // const response = await fetch(`/api/reactivate-subscription?subscriptionId=${subscription.id}`, {
      //   method: 'POST',
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to reactivate subscription');
      // }
      
      // For demo purposes, we'll just show a success message
      toast({
        title: "Subscription reactivated",
        description: "Your subscription has been successfully reactivated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="font-medium text-lg">{planName}</h3>
          <p className="text-gray-500">
            {isFreeBasicPlan ? 'FREE' : `$${amount} ${currency} / month`}
          </p>
        </div>
        <Badge 
          variant={
            isFreeBasicPlan ? 'secondary' :
            subscription.status === 'active' ? 'default' : 
            subscription.status === 'canceled' ? 'destructive' : 
            subscription.status === 'trialing' ? 'secondary' : 
            'outline'
          }
        >
          {status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Started on</p>
          <p>{startDate}</p>
        </div>
        <div>
          <p className="text-gray-500">Current period ends</p>
          <p>{currentPeriodEnd}</p>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <div className="flex flex-wrap gap-2">
          {/* Free Basic plan options */}
          {isFreeBasicPlan && (
            <Button variant="default" onClick={handleUpdateSubscription}>
              Upgrade Plan
            </Button>
          )}
          
          {/* Paid subscription options */}
          {!isFreeBasicPlan && subscription.status === 'active' && (
            <>
              <Button variant="outline" onClick={handleUpdateSubscription}>
                Change Plan
              </Button>
              
              <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Cancel Subscription</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your subscription will remain active until the end of the current billing period ({currentPeriodEnd}). After that, you will lose access to premium features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleCancelSubscription}
                      disabled={isLoading}
                    >
                      {isLoading ? "Cancelling..." : "Yes, Cancel Subscription"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          
          {subscription.status === 'canceled' && (
            <Button onClick={handleReactivateSubscription} disabled={isLoading}>
              {isLoading ? "Reactivating..." : "Reactivate Subscription"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
