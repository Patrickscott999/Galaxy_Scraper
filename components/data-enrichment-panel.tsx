"use client"

import { useState } from "react"
import { Sparkles, Tag, Users, MessageSquare, X, PieChart, KeyRound, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/authContext"
import { useToast } from "@/components/ui/use-toast"
import TierLimitIndicator from "@/components/tier-limit-indicator"

interface DataEnrichmentPanelProps {
  data: any[]
  onClose: () => void
}

export function DataEnrichmentPanel({ data, onClose }: DataEnrichmentPanelProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [enrichedData, setEnrichedData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("entities")
  const [isExpanded, setIsExpanded] = useState(false)

  // Get user's subscription tier
  const getUserTier = () => {
    if (typeof window !== 'undefined') {
      const userPlan = localStorage.getItem('userPlan')
      if (userPlan === 'enterprise') return 'enterprise'
      if (userPlan === 'pro') return 'pro'
      return 'basic'
    }
    return 'basic'
  }

  const userTier = getUserTier()

  // Function to enrich data
  const enrichData = async () => {
    if (!data || data.length === 0) {
      toast({
        title: "No Data to Enrich",
        description: "Please scrape some data first before attempting enrichment.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      // For development mode only - do not force tier in production
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        // No need to force the tier - UI will handle it through user selection
        // This is only for testing the tier selector functionality
      }
      
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data.slice(0, 300), // Limit to prevent excessive requests
          userId: user?.uid || 'anonymous',
          enrichmentTypes: ['entities', 'sentiment', 'categories', 'keywords', 'summaries', 'relations']
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: "Subscription Required",
            description: result.error || "This feature requires a Pro or Enterprise subscription.",
            variant: "destructive",
          })
        } else {
          throw new Error(result.error || 'Failed to enrich data')
        }
      } else {
        setEnrichedData(result.enriched)
        toast({
          title: "Data Enriched Successfully",
          description: "AI analysis has been applied to your data.",
        })
      }
    } catch (err) {
      console.error('Error during data enrichment:', err)
      toast({
        title: "Enrichment Failed",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get the appropriate color for sentiment
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-500/20 text-green-500 border-green-500/30'
      case 'negative':
        return 'bg-red-500/20 text-red-500 border-red-500/30'
      case 'neutral':
      default:
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
    }
  }

  // Get entity type color
  const getEntityTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      person: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      organization: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      location: 'bg-green-500/20 text-green-400 border-green-500/30',
      product: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      event: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      date: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    }

    return colors[type.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  // Helper function to get max items based on user tier
  const getUserTierMaxItems = (): number => {
    const userTier = typeof window !== 'undefined' ? localStorage.getItem('userPlan') || 'free' : 'free'
    switch (userTier) {
      case 'free':
      case 'basic':
        return 5
      case 'pro':
        return 50
      case 'enterprise':
        return Infinity
      default:
        return 5
    }
  }

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96'} bg-slate-900 border border-slate-700 rounded-xl shadow-xl transition-all duration-300 z-50`}>
      <div className="flex flex-col p-4 border-b border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Data Enrichment</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Tier limit indicator */}
        {enrichedData && (
          <TierLimitIndicator 
            userTier={userTier}
            itemsProcessed={data?.length || 0}
            maxItems={getUserTierMaxItems()}
            showUpgradeButton={userTier !== 'enterprise'}
          />
        )}
      </div>
      
      <div className="p-4">
        {!enrichedData && !isLoading ? (
          <div className="space-y-4">
            <p className="text-slate-300 text-sm">
              Enrich your scraped data with AI-powered analysis to extract entities, detect sentiment, categorize content, and more.
            </p>
            {userTier === 'basic' ? (
              <div className="bg-slate-800 rounded-lg p-4 text-center space-y-3">
                <h3 className="text-white font-medium">Pro Feature</h3>
                <p className="text-slate-300 text-sm">
                  Data enrichment is available for Pro and Enterprise subscribers only.
                </p>
                <Button 
                  variant="default" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = '/subscriptions'}
                >
                  Upgrade Subscription
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={enrichData}
                disabled={isLoading || data.length === 0}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Enrich Data with AI
              </Button>
            )}
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
                  <div className="absolute inset-0 -z-10 h-8 w-8 animate-spin rounded-full border-2 border-t-purple-500 border-l-purple-500 border-r-transparent border-b-transparent"></div>
                </div>
                <p className="text-slate-300 text-sm">Analyzing your data...</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-slate-800" />
              <Skeleton className="h-4 w-full bg-slate-800" />
              <Skeleton className="h-4 w-5/6 bg-slate-800" />
            </div>
          </div>
        ) : (
          <div className={`space-y-4 overflow-auto ${isExpanded ? 'max-h-[calc(100vh-8rem)]' : 'max-h-96'}`}>
            <Tabs defaultValue="entities" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 bg-slate-800 mb-4">
                <TabsTrigger value="entities" className="flex gap-1 items-center">
                  <Users className="h-3.5 w-3.5" />
                  <span className={isExpanded ? '' : 'sr-only'}>Entities</span>
                </TabsTrigger>
                <TabsTrigger value="sentiment" className="flex gap-1 items-center">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className={isExpanded ? '' : 'sr-only'}>Sentiment</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex gap-1 items-center">
                  <Tag className="h-3.5 w-3.5" />
                  <span className={isExpanded ? '' : 'sr-only'}>Categories</span>
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex gap-1 items-center">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span className={isExpanded ? '' : 'sr-only'}>Keywords</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="entities" className="space-y-4 mt-0">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Named Entities</CardTitle>
                    <CardDescription>
                      People, organizations, locations, and other entities detected in your data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enrichedData?.entities?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {enrichedData.entities.map((entity: any, index: number) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className={`${getEntityTypeColor(entity.type)} px-2 py-1`}
                          >
                            <span className="font-medium">{entity.entity}</span>
                            <span className="text-xs ml-1.5 opacity-80">({entity.type})</span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-2">No entities detected</p>
                    )}
                  </CardContent>
                </Card>
                
                {enrichedData?.relations && Object.keys(enrichedData.relations).length > 0 && userTier === 'enterprise' && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Entity Relationships</CardTitle>
                      <CardDescription>
                        Connections between entities found in your data.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(enrichedData.relations).map(([entity, relations]: [string, any], index) => (
                          <div key={index} className="border-b border-slate-700 last:border-0 pb-2 last:pb-0">
                            <div className="font-medium text-white mb-1">{entity}</div>
                            <ul className="text-sm text-slate-300 space-y-1 pl-2">
                              {relations.map((relation: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-purple-400 text-lg leading-none">•</span>
                                  <span>{relation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="sentiment" className="space-y-4 mt-0">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Overall Sentiment</CardTitle>
                    <CardDescription>
                      The emotional tone detected in your data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enrichedData?.sentiment ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center mt-2">
                          <Badge 
                            variant="outline" 
                            className={`${getSentimentColor(enrichedData.sentiment.sentiment)} text-lg px-4 py-2`}
                          >
                            {enrichedData.sentiment.sentiment.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              enrichedData.sentiment.score > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.abs(enrichedData.sentiment.score) * 100}%`,
                              marginLeft: enrichedData.sentiment.score < 0 ? 'auto' : 0
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Negative</span>
                          <span>Neutral</span>
                          <span>Positive</span>
                        </div>
                        
                        {Object.keys(enrichedData.sentiment.aspects).length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-700">
                            <h4 className="text-sm font-medium text-white mb-2">Aspect Sentiments</h4>
                            <div className="space-y-2">
                              {Object.entries(enrichedData.sentiment.aspects).map(([aspect, sentiment]: [string, any], index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-slate-300 text-sm">{aspect}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`${getSentimentColor(sentiment)}`}
                                  >
                                    {sentiment}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-2">No sentiment analysis available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="categories" className="space-y-4 mt-0">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Content Categories</CardTitle>
                    <CardDescription>
                      Topics and themes identified in your data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enrichedData?.categories?.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {enrichedData.categories.map((category: string, index: number) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-2 py-1"
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                        
                        {userTier === 'enterprise' && enrichedData?.summary && (
                          <div className="mt-4 pt-4 border-t border-slate-700">
                            <h4 className="text-sm font-medium text-white mb-2">AI Summary</h4>
                            <p className="text-slate-300 text-sm">
                              {enrichedData.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-2">No categories detected</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="keywords" className="space-y-4 mt-0">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Important Keywords</CardTitle>
                    <CardDescription>
                      Significant terms and phrases extracted from your data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enrichedData?.keywords?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {enrichedData.keywords.map((keyword: string, index: number) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-2 py-1"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-2">
                        {userTier === 'pro' ? 
                          "Keywords extraction requires Enterprise tier" :
                          "No keywords detected"
                        }
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
