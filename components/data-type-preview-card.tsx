"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Briefcase, Tag, Newspaper, Home, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTypeSample } from "@/lib/utils/data-type-samples"

interface DataTypePreviewCardProps {
  data: DataTypeSample
  userTier: "basic" | "pro" | "enterprise"
  onUpgrade: () => void
}

// Helper function to get the appropriate icon
const getIcon = (iconName: string) => {
  switch (iconName) {
    case "briefcase":
      return <Briefcase className="h-5 w-5" />
    case "tag":
      return <Tag className="h-5 w-5" />
    case "newspaper":
      return <Newspaper className="h-5 w-5" />
    case "home":
      return <Home className="h-5 w-5" />
    default:
      return <Briefcase className="h-5 w-5" />
  }
}

export function DataTypePreviewCard({ data, userTier, onUpgrade }: DataTypePreviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Check availability for the user's current tier
  const isAvailable = data.tiers[userTier]?.available || false
  
  // Determine which tiers to show (only show the user's tier and higher)
  const tierOrder = ["basic", "pro", "enterprise"] as const
  const userTierIndex = tierOrder.indexOf(userTier)
  const visibleTiers = tierOrder.slice(userTierIndex)
  
  // Get the highest available tier for this data type
  const highestAvailableTier = tierOrder.filter(tier => data.tiers[tier]?.available).pop() || "enterprise"
  
  // Get sample data to display in the preview
  const sampleData = data.tiers[userTier]?.sampleData || []
  const sampleKeys = sampleData.length > 0 ? Object.keys(sampleData[0]) : []
  
  // Safely get tier limits
  const getTierLimits = (tier: "basic" | "pro" | "enterprise") => {
    return data.tiers[tier]?.limits || ["Not available"]
  }

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isExpanded ? "shadow-lg" : "shadow"} border-slate-800 bg-slate-900/60 hover:bg-slate-900/80`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${isAvailable ? "bg-purple-900/50" : "bg-slate-800/50"}`}>
              {getIcon(data.icon)}
            </div>
            <CardTitle className="text-xl text-white">
              {data.type.charAt(0).toUpperCase() + data.type.slice(1).replace("_", " ")} Data
            </CardTitle>
          </div>
          <Badge variant={isAvailable ? "default" : "secondary"} className={isAvailable ? "bg-purple-700" : "bg-slate-700"}>
            {isAvailable ? "Available" : "Locked"}
          </Badge>
        </div>
        <CardDescription className="text-slate-300 mt-2">
          {data.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        {!isAvailable ? (
          <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-lg p-6 text-center">
            <Lock className="h-8 w-8 text-slate-400 mb-2" />
            <h3 className="text-lg font-medium text-white mb-1">Upgrade Required</h3>
            <p className="text-slate-400 mb-4">
              This data type is available in the {highestAvailableTier.charAt(0).toUpperCase() + highestAvailableTier.slice(1)} tier.
            </p>
            <Button 
              onClick={onUpgrade}
              className="bg-purple-700 hover:bg-purple-600"
            >
              Upgrade to Access
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-800/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/70">
                      {sampleKeys.slice(0, 4).map((key) => (
                        <th key={key} className="px-4 py-2 text-left font-medium text-slate-300">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.slice(0, 2).map((item, index) => (
                      <tr key={index} className="border-t border-slate-700/50">
                        {sampleKeys.slice(0, 4).map((key) => (
                          <td key={key} className="px-4 py-2 text-slate-300">
                            {String(item[key] || '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 text-center text-xs text-slate-400 bg-slate-800/50 border-t border-slate-700/50">
                Sample data (showing {sampleData.slice(0, 2).length} of {data.tiers[userTier]?.sampleData.length} results)
              </div>
            </div>
            
            {isExpanded && (
              <div className="pt-2">
                <Tabs defaultValue={userTier}>
                  <TabsList className="grid grid-cols-3 bg-slate-800">
                    {visibleTiers.map((tier) => (
                      <TabsTrigger 
                        key={tier} 
                        value={tier}
                        disabled={!data.tiers[tier]?.available}
                        className={data.tiers[tier]?.available ? "" : "text-slate-500"}
                      >
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {visibleTiers.map((tier) => (
                    <TabsContent key={tier} value={tier} className="space-y-4 pt-3">
                      <div className="rounded-lg border border-slate-800 overflow-hidden">
                        <div className="bg-slate-800/70 px-4 py-2">
                          <h4 className="font-medium text-white">Available Fields</h4>
                        </div>
                        <div className="p-4 bg-slate-800/30 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {data.tiers[tier]?.sampleData.length ? (
                            Object.keys(data.tiers[tier]?.sampleData[0] || {}).map((field) => (
                              <div key={field} className="flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5 text-purple-400" />
                                <span className="text-sm text-slate-300">{field}</span>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-center text-slate-400 py-2">
                              No fields available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="rounded-lg border border-slate-800 overflow-hidden">
                        <div className="bg-slate-800/70 px-4 py-2">
                          <h4 className="font-medium text-white">Tier Limits</h4>
                        </div>
                        <div className="p-4 bg-slate-800/30">
                          <ul className="space-y-1.5">
                            {getTierLimits(tier).map((limit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-purple-400 text-lg leading-none">•</span>
                                <span className="text-sm text-slate-300">{limit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-1 border-t border-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-400">
          {isAvailable 
            ? `Available in your ${userTier} plan` 
            : `Upgrade to ${highestAvailableTier} to access`}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white"
        >
          {isExpanded ? (
            <>Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>More <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
