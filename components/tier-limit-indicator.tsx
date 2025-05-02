import React from 'react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'

interface TierLimitIndicatorProps {
  userTier: string
  itemsProcessed: number
  maxItems: number
  showUpgradeButton?: boolean
}

const tierColorMap: Record<string, string> = {
  free: "text-blue-400",
  basic: "text-blue-400",
  pro: "text-purple-500",
  enterprise: "text-amber-500"
}

const TierLimitIndicator: React.FC<TierLimitIndicatorProps> = ({
  userTier,
  itemsProcessed,
  maxItems,
  showUpgradeButton = true
}) => {
  const { toast } = useToast()
  // Calculate percentage with safety checks for division by zero
  const percentage = maxItems === Infinity ? 
    Math.min(100, (itemsProcessed / 100) * 100) : // Use 100 as base for infinity
    maxItems > 0 ? Math.min(100, (itemsProcessed / maxItems) * 100) : 0
  
  const isNearLimit = maxItems !== Infinity && itemsProcessed >= maxItems * 0.8
  const isAtLimit = maxItems !== Infinity && itemsProcessed >= maxItems
  
  // Define upgrade path based on current tier
  const upgradeLink = userTier === 'free' || userTier === 'basic' 
    ? '/subscriptions?plan=pro'
    : userTier === 'pro'
      ? '/subscriptions?plan=enterprise'
      : '/subscriptions'

  // Format max items display
  const maxItemsDisplay = maxItems === Infinity ? "Unlimited" : maxItems.toString()
  
  // Progress color based on usage
  const progressColor = isAtLimit 
    ? "bg-red-500" 
    : isNearLimit 
      ? "bg-amber-500" 
      : "bg-gradient-to-r from-indigo-500 to-purple-600"

  return (
    <div className="w-full space-y-2 p-3 bg-slate-800 rounded-md border border-slate-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Tier:</span>
          <span className={`text-sm font-medium capitalize ${tierColorMap[userTier] || "text-slate-300"}`}>
            {userTier}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            {itemsProcessed} / {maxItemsDisplay} items
          </span>
          
          {showUpgradeButton && userTier !== 'enterprise' && (
            <Link href={upgradeLink}>
              <Button 
                variant="outline" 
                size="sm"
                className="h-7 bg-slate-900 border-slate-700 hover:bg-slate-700 hover:text-white"
                onClick={() => {
                  toast({
                    title: "Upgrade your plan",
                    description: "Get access to more enrichment items and features",
                  })
                }}
              >
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <Progress
        value={percentage}
        className={`h-1.5 bg-slate-700 [&>div]:${progressColor}`}
      />
      
      {isAtLimit && (
        <p className="text-xs text-red-400">
          You've reached your {userTier} tier limit. Upgrade to process more items.
        </p>
      )}
      
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-amber-400">
          You're approaching your {userTier} tier limit.
        </p>
      )}
    </div>
  )
}

export default TierLimitIndicator
