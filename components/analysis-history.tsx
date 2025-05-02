"use client"

import { useState } from "react"
import { ChevronDown, Download, History, BarChart, LineChart, PieChart, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function AnalysisHistory() {
  const [isOpen, setIsOpen] = useState(true)

  const historyItems = [
    {
      id: 1,
      source: "financial_data_q1_2025.csv",
      type: "Financial Data",
      date: "2025-05-01 14:30",
      count: 42,
      chartType: "line",
    },
    {
      id: 2,
      source: "market_analysis_2025.json",
      type: "Market Analysis",
      date: "2025-05-01 10:15",
      count: 128,
      chartType: "bar",
    },
    {
      id: 3,
      source: "performance_metrics_april.xlsx",
      type: "Performance Metrics",
      date: "2025-04-30 16:45",
      count: 17,
      chartType: "radar",
    },
    {
      id: 4,
      source: "demographic_survey_results.csv",
      type: "Demographic Data",
      date: "2025-04-29 09:20",
      count: 56,
      chartType: "doughnut",
    },
  ]

  const getChartIcon = (chartType: string) => {
    switch (chartType) {
      case "line":
        return <LineChart className="h-4 w-4 text-blue-400" />
      case "bar":
        return <BarChart className="h-4 w-4 text-purple-400" />
      case "doughnut":
        return <PieChart className="h-4 w-4 text-pink-400" />
      case "radar":
        return <Activity className="h-4 w-4 text-green-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-purple-900/20"
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Analysis History</h2>
        </div>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="px-6 pb-6">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <div className="divide-y divide-white/10">
              {historyItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getChartIcon(item.chartType)}
                      <p className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">{item.source}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.count} records</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
