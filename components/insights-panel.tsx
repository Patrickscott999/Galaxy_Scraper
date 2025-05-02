"use client"

import { X, Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InsightsPanelProps {
  show: boolean
  onClose: () => void
  dataType: string
}

export function InsightsPanel({ show, onClose, dataType }: InsightsPanelProps) {
  if (!show) return null

  // Different insights based on data type
  const insights = {
    financial: {
      summary:
        "Financial data shows a 12% increase in revenue over the last quarter with expenses remaining stable, resulting in a 15% profit margin improvement.",
      metrics: [
        { label: "Revenue Growth", value: "+12%" },
        { label: "Profit Margin", value: "15%" },
        { label: "Cost Reduction", value: "8%" },
        { label: "ROI", value: "22%" },
      ],
      keyInsights: [
        "Q2 revenue exceeded projections by 8%",
        "Operating expenses decreased by 5% due to automation",
        "New product line contributed 18% to overall revenue",
      ],
      anomalies: ["Marketing expenses spiked in March (+32%)"],
    },
    market: {
      summary:
        "Market analysis indicates your product has gained 5% market share, now holding 25% of the total addressable market. Competitor A has lost 3% share.",
      metrics: [
        { label: "Market Share", value: "25%" },
        { label: "Growth Rate", value: "+5%" },
        { label: "Competitors", value: "4" },
        { label: "Market Size", value: "$2.8B" },
      ],
      keyInsights: [
        "Product A is outperforming competitors in the premium segment",
        "Eastern region shows highest adoption rate (+15%)",
        "Price sensitivity decreased in core demographic",
      ],
      anomalies: ["Unexpected competitor entry in Q2"],
    },
    performance: {
      summary:
        "Performance metrics show a 30% improvement in system response time and 15% increase in user engagement. Reliability metrics are stable at 99.95% uptime.",
      metrics: [
        { label: "Response Time", value: "-30%" },
        { label: "Reliability", value: "99.95%" },
        { label: "User Engagement", value: "+15%" },
        { label: "Feature Usage", value: "78%" },
      ],
      keyInsights: [
        "Database optimization reduced query time by 45%",
        "New UI increased conversion rate by 12%",
        "Mobile performance improved by 25% after CDN implementation",
      ],
      anomalies: ["Periodic latency spikes during peak hours"],
    },
    demographic: {
      summary:
        "Demographic analysis shows your product is most popular with the 25-34 age group (30%), followed by 35-44 (25%). Urban users represent 65% of your customer base.",
      metrics: [
        { label: "Primary Age", value: "25-34" },
        { label: "Urban Users", value: "65%" },
        { label: "Income Level", value: "$75K+" },
        { label: "Retention", value: "72%" },
      ],
      keyInsights: [
        "Female users increased by 18% after recent campaign",
        "High-income segment shows 35% higher LTV",
        "Suburban growth outpacing urban by 2:1 ratio",
      ],
      anomalies: ["Unexpected drop in 18-24 demographic (-8%)"],
    },
  }

  const currentInsights = insights[dataType as keyof typeof insights] || insights.financial

  return (
    <div className="rounded-xl backdrop-blur-md bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10 p-6 shadow-lg transition-all duration-500 animate-fadeIn sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/50 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-lg font-semibold text-white">AI Insights</h2>
        </div>

        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-white/80 text-sm leading-relaxed">{currentInsights.summary}</p>

        <div className="grid grid-cols-2 gap-3">
          {currentInsights.metrics.map((metric, index) => (
            <div key={index} className="rounded-lg bg-white/5 p-3 border border-white/10">
              <div className="text-purple-400 text-xs font-medium mb-1">{metric.label}</div>
              <div className="text-white text-sm font-semibold">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-white/5 p-3 border border-white/10">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-medium mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Key Insights</span>
          </div>
          <ul className="text-white/80 text-sm space-y-1">
            {currentInsights.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {currentInsights.anomalies.length > 0 && (
          <div className="rounded-lg bg-red-900/20 p-3 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 text-xs font-medium mb-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Anomalies Detected</span>
            </div>
            <ul className="text-white/80 text-sm space-y-1">
              {currentInsights.anomalies.map((anomaly, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  <span>{anomaly}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
