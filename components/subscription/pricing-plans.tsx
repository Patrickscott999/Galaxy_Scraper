"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SubscriptionModal } from "./subscription-modal";

// Define plan features - these would come from your Stripe products
const plans = [
  {
    name: "Basic",
    description: "Essential features for individuals",
    price: "FREE",
    priceId: "", // Free tier doesn't need a Stripe Price ID
    features: [
      "Basic feature access",
      "1 user",
      "5 projects",
      "2GB storage",
      "Email support",
    ],
    recommended: false,
    isFree: true,
  },
  {
    name: "Pro",
    description: "Advanced features for professionals",
    price: "$10",
    priceId: "price_XXXXXXXXXXXX", // Replace with your actual Stripe Price ID
    features: [
      "All Basic features",
      "5 users",
      "20 projects",
      "10GB storage",
      "Priority support",
      "Advanced analytics",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    description: "Complete solution for teams",
    price: "$20",
    priceId: "price_XXXXXXXXXXXX", // Replace with your actual Stripe Price ID
    features: [
      "All Pro features",
      "Unlimited users",
      "Unlimited projects",
      "100GB storage",
      "24/7 dedicated support",
      "Custom integrations",
      "Team management",
    ],
    recommended: false,
  },
];

export function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isConfigured } = useAuth();
  const router = useRouter();

  // Handle subscription selection
  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this plan",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    // For free tier, just show a success message
    if (plan.isFree) {
      toast({
        title: "Free Plan Activated",
        description: "You are now on the Basic free plan",
      });
      
      // Here you would typically update the user's plan in your database
      // For example: updateUserPlan(user.uid, 'basic', 'free');
      return;
    }

    // For paid plans, open the subscription modal
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Choose the Right Plan for You
        </h2>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Select a subscription tier that fits your needs. All plans include access to our core features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${
              plan.recommended
                ? "border-primary shadow-lg scale-105 z-10"
                : ""
            }`}
          >
            {plan.recommended && (
              <div className="bg-primary text-primary-foreground text-sm text-center py-1 rounded-t-lg font-medium">
                RECOMMENDED
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                {!plan.isFree && <span className="text-gray-500 ml-1">/month</span>}
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSelectPlan(plan)}
                variant={plan.recommended ? "default" : "outline"}
                className="w-full"
              >
                {plan.isFree ? "Get Started Free" : plan.recommended ? "Subscribe Now" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
          userId={user?.uid || ""}
        />
      )}
    </div>
  );
}
