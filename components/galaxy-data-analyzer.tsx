"use client"

import { useState } from "react"
import { Header } from "./header"
import { DataSourcePanel } from "./data-source-panel"
import { AnalysisResults } from "./analysis-results"
import { AnalysisHistory } from "./analysis-history"
import { InsightsPanel } from "./insights-panel"
import { DataVisualization } from "./data-visualization"
import { FilterPanel } from "./filter-panel"
import { mockDataSets } from "@/lib/mock-data"

export function GalaxyDataAnalyzer() {
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [visualizationData, setVisualizationData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedDataType, setSelectedDataType] = useState("financial")

  const handleAnalyze = (source: string, dataType: string) => {
    setIsLoading(true)
    setSelectedDataType(dataType)

    // Simulate API call with timeout
    setTimeout(() => {
      const data = mockDataSets[dataType as keyof typeof mockDataSets] || []
      setAnalysisResults(data)

      // Set visualization data based on the data type
      if (dataType === "financial") {
        setVisualizationData({
          type: "line",
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Revenue",
              data: [65, 59, 80, 81, 56, 55],
              borderColor: "#a855f7",
              backgroundColor: "rgba(168, 85, 247, 0.2)",
            },
            {
              label: "Expenses",
              data: [28, 48, 40, 19, 36, 27],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
            },
          ],
        })
      } else if (dataType === "market") {
        setVisualizationData({
          type: "bar",
          labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
          datasets: [
            {
              label: "Market Share (%)",
              data: [25, 20, 30, 15, 10],
              backgroundColor: [
                "rgba(168, 85, 247, 0.7)",
                "rgba(139, 92, 246, 0.7)",
                "rgba(99, 102, 241, 0.7)",
                "rgba(59, 130, 246, 0.7)",
                "rgba(14, 165, 233, 0.7)",
              ],
            },
          ],
        })
      } else if (dataType === "performance") {
        setVisualizationData({
          type: "radar",
          labels: ["Speed", "Reliability", "Usability", "Features", "Support", "Price"],
          datasets: [
            {
              label: "Current Version",
              data: [85, 70, 90, 80, 75, 65],
              borderColor: "#a855f7",
              backgroundColor: "rgba(168, 85, 247, 0.2)",
            },
            {
              label: "Previous Version",
              data: [65, 60, 70, 75, 70, 80],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
            },
          ],
        })
      } else if (dataType === "demographic") {
        setVisualizationData({
          type: "doughnut",
          labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
          datasets: [
            {
              data: [15, 30, 25, 20, 10],
              backgroundColor: [
                "rgba(168, 85, 247, 0.7)",
                "rgba(139, 92, 246, 0.7)",
                "rgba(99, 102, 241, 0.7)",
                "rgba(59, 130, 246, 0.7)",
                "rgba(14, 165, 233, 0.7)",
              ],
            },
          ],
        })
      }

      setIsLoading(false)
      setShowInsights(true)
    }, 1500)
  }

  const handleFilterChange = (filters: string[]) => {
    // Only update state if the filters have actually changed
    if (JSON.stringify(activeFilters) !== JSON.stringify(filters)) {
      setActiveFilters(filters)
      // In a real app, you would filter the results based on these filters
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 relative">
      <div className="stars absolute inset-0 overflow-hidden opacity-30 pointer-events-none" />

      <Header />

      <main className="mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <DataSourcePanel onAnalyze={handleAnalyze} isLoading={isLoading} />
            <div className="mt-6">
              <FilterPanel onFilterChange={handleFilterChange} dataType={selectedDataType} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {visualizationData && !isLoading && <DataVisualization data={visualizationData} />}

            <AnalysisResults data={analysisResults} isLoading={isLoading} activeFilters={activeFilters} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalysisHistory />
              </div>
              <div className="lg:col-span-1">
                <InsightsPanel show={showInsights} onClose={() => setShowInsights(false)} dataType={selectedDataType} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
