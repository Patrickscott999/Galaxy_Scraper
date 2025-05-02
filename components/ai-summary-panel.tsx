"use client"

import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AiSummaryPanelProps {
  show: boolean
  onClose: () => void
  analysis?: string | null
}

export function AiSummaryPanel({ show, onClose, analysis }: AiSummaryPanelProps) {
  if (!show) return null
  
  // Parse the AI analysis into sections if available
  const getAnalysisContent = () => {
    if (!analysis) {
      // Return mock data if no analysis is provided
      return {
        summary: "The scraped data shows 42 job listings with an average salary of $85,000. Most positions are for software engineers and data scientists, with 65% offering remote work options.",
        insights: [
          "High demand for AI/ML specialists",
          "Salaries increased 8% since last quarter",
          "Most companies offer flexible work arrangements"
        ],
        stats: {
          "Top Skills": "Python, React, SQL",
          "Experience": "3-5 years (avg.)",
          "Locations": "SF, NYC, Remote",
          "Trend": "+12% from last scan"
        }
      };
    }
    
    try {
      // Try to extract structured data from the analysis
      // This is a simple implementation - in a production app,
      // you might want the API to return structured data directly
      
      // Extract insights (bullet points)
      const insightRegex = /[•\-*]\s*([^\n]+)/g;
      const insights: string[] = [];
      let match;
      while ((match = insightRegex.exec(analysis)) !== null) {
        insights.push(match[1].trim());
      }
      
      // Extract the first paragraph as a summary
      const paragraphs = analysis.split('\n\n').filter(p => p.trim().length > 0);
      const summary = paragraphs[0] || "No summary available.";
      
      // Extract any key-value pairs (potential stats)
      const statsRegex = /([\w\s]+):\s*([^\n]+)/g;
      const stats: Record<string, string> = {};
      while ((match = statsRegex.exec(analysis)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (key && value && Object.keys(stats).length < 4) { // Limit to 4 stats
          stats[key] = value;
        }
      }
      
      // If we couldn't extract structured stats, provide some defaults
      if (Object.keys(stats).length === 0) {
        if (insights.length > 0) {
          return {
            summary,
            insights,
            stats: {
              "Data Points": "Multiple",
              "Analysis": "AI-Generated",
              "Quality": "High",
              "Source": "Web Scraping"
            }
          };
        }
      }
      
      return {
        summary,
        insights: insights.length > 0 ? insights : ["No specific insights extracted."],
        stats: Object.keys(stats).length > 0 ? stats : {
          "Data Points": "Multiple",
          "Analysis": "AI-Generated",
          "Quality": "High",
          "Source": "Web Scraping"
        }
      };
    } catch (err) {
      console.error('Error parsing AI analysis:', err);
      // Fallback to displaying the raw analysis
      return {
        summary: analysis || "No summary available.",
        insights: [],
        stats: {
          "Analysis": "AI-Generated",
          "Source": "Web Scraping"
        }
      };
    }
  };
  
  const content = getAnalysisContent();

  return (
    <div className="rounded-xl backdrop-blur-md bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10 p-6 shadow-lg transition-all duration-500 animate-fadeIn sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/50 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-lg font-semibold text-white">AI Summary</h2>
        </div>

        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-white/80 text-sm leading-relaxed">
          {content.summary}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(content.stats).map(([key, value], index) => (
            <div key={index} className="rounded-lg bg-white/5 p-3 border border-white/10">
              <div className="text-purple-400 text-xs font-medium mb-1">{key}</div>
              <div className="text-white text-sm font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-white/5 p-3 border border-white/10">
          <div className="text-purple-400 text-xs font-medium mb-2">Key Insights</div>
          <ul className="text-white/80 text-sm space-y-1">
            {content.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-400 text-lg leading-none">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
