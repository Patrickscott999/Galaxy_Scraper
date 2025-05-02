"use client"

import { useState, useEffect } from "react"
import { Header } from "./header"
import { UrlInputPanel } from "./url-input-panel"
import { ResultsTable } from "./results-table"
import { ScrapeHistory } from "./scrape-history"
import { AiSummaryPanel } from "./ai-summary-panel"
import { DataTypePreviews } from "./data-type-previews"
import { DataEnrichmentPanel } from "./data-enrichment-panel"
import { mockScrapeData } from "@/lib/mock-data"
import { useAuth } from "@/lib/authContext"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Lock, Sparkles } from "lucide-react"
import { Button } from "./ui/button"

export function GalaxyScraper() {
  const [scrapeResults, setScrapeResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAiSummary, setShowAiSummary] = useState(false)
  const [showEnrichment, setShowEnrichment] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [upgradeBanner, setUpgradeBanner] = useState<{show: boolean, message: string} | null>(null)
  
  const { user, isConfigured } = useAuth()
  const { toast } = useToast()

  // Get user's subscription tier
  const getUserTier = () => {
    // In a production app, this would come from your database
    // For now, we'll use localStorage as a simple simulation
    if (typeof window !== 'undefined') {
      const userPlan = localStorage.getItem('userPlan');
      if (userPlan === 'pro') return 'pro';
      if (userPlan === 'enterprise') return 'enterprise';
      return 'basic'; // Default to basic tier
    }
    return 'basic';
  }

  const handleScrape = async (url: string, dataType: string) => {
    // Reset states
    setIsLoading(true);
    setError(null);
    setUpgradeBanner(null);
    setAnalysis(null);
    
    try {
      // Check if user is logged in
      if (!user && isConfigured) {
        toast({
          title: "Authentication Required",
          description: "Please log in to use the web scraper.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Check if URL is valid
      try {
        new URL(url);
      } catch (e) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL including http:// or https://",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Get user's subscription tier
      const userTier = getUserTier();
      
      // Make API request to the scrape endpoint
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          dataType: dataType.toLowerCase(),
          userId: user?.uid || 'anonymous',
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Check if it's a tier limitation error
        if (response.status === 403 && result.error?.includes('tier')) {
          setUpgradeBanner({
            show: true,
            message: result.error
          });
          // Fall back to mock data for demo purposes
          setScrapeResults(mockScrapeData[dataType as keyof typeof mockScrapeData] || []);
        } else {
          throw new Error(result.error || 'Failed to scrape data');
        }
      } else {
        // Set the scraped data
        setScrapeResults(result.data || []);
        
        // Set AI analysis if available
        if (result.analysis) {
          setAnalysis(result.analysis);
          setShowAiSummary(true);
        }
        
        // Save to scrape history
        saveToHistory(url, dataType, result.data);
      }
    } catch (err) {
      console.error('Error during scraping:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      // Fall back to mock data for demo purposes
      setScrapeResults(mockScrapeData[dataType as keyof typeof mockScrapeData] || []);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save scrape to history
  const saveToHistory = (url: string, dataType: string, data: any[]) => {
    if (typeof window !== 'undefined') {
      try {
        // Get existing history or initialize new array
        const historyJson = localStorage.getItem('scrapeHistory');
        const history = historyJson ? JSON.parse(historyJson) : [];
        
        // Add new item to history
        history.unshift({
          id: Date.now().toString(),
          url,
          dataType, 
          timestamp: new Date().toISOString(),
          resultCount: data.length
        });
        
        // Keep only the last 10 items
        const trimmedHistory = history.slice(0, 10);
        
        // Save back to localStorage
        localStorage.setItem('scrapeHistory', JSON.stringify(trimmedHistory));
      } catch (err) {
        console.error('Error saving to history:', err);
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 relative">
      <div className="stars absolute inset-0 overflow-hidden opacity-30 pointer-events-none" />

      <Header />

      <main className="mt-8 space-y-8">
        {upgradeBanner && (
          <div className="animate-pulse-gentle">
            <div className="rounded-lg overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20">
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-purple-200 mr-2" />
                  <h3 className="text-white font-bold text-lg">Subscription Limit Reached</h3>
                </div>
                <div className="bg-purple-700/50 text-purple-100 text-xs font-bold uppercase px-2 py-1 rounded-full border border-purple-500/50">Basic Plan</div>
              </div>
              
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/70 px-6 py-5 backdrop-blur-sm">
                <div className="text-purple-100 text-base font-medium mb-4">
                  {upgradeBanner.message}
                </div>
                
                <div className="bg-slate-800/60 rounded-lg p-4 mb-4 border border-purple-500/30">
                  <h4 className="text-purple-200 font-semibold mb-2">Upgrade for More Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">✓</span>
                      <span className="text-gray-300">Access all data types (News, Jobs, Prices, Real Estate)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">✓</span>
                      <span className="text-gray-300">Up to 50 data points per request</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">✓</span>
                      <span className="text-gray-300">AI-powered data analysis</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5 border border-purple-400/20"
                    onClick={() => window.location.href = '/subscriptions'}
                  >
                    Upgrade Your Plan Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <UrlInputPanel onScrape={handleScrape} isLoading={isLoading} />

        {/* Show data type previews if no active scrape is happening */}
        {!isLoading && scrapeResults.length === 0 && (
          <div className="pt-4 pb-8">
            <DataTypePreviews />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Scraped Results</h2>
                {scrapeResults.length > 0 && !isLoading && (
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    onClick={() => setShowEnrichment(true)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enrich Data
                  </Button>
                )}
              </div>
              <ResultsTable data={scrapeResults} isLoading={isLoading} />
            </div>
            <ScrapeHistory />
          </div>

          <div className="lg:col-span-1">
            <AiSummaryPanel 
              show={showAiSummary} 
              onClose={() => setShowAiSummary(false)} 
              analysis={analysis}
            />
          </div>
        </div>
      </main>

      {/* Data Enrichment Panel */}
      {showEnrichment && (
        <DataEnrichmentPanel 
          data={scrapeResults} 
          onClose={() => setShowEnrichment(false)} 
        />
      )}
    </div>
  )
}
