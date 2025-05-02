"use client"

import { useState, useEffect } from "react"
import { Filter, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FilterPanelProps {
  onFilterChange: (filters: string[]) => void
  dataType: string
}

export function FilterPanel({ onFilterChange, dataType }: FilterPanelProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Different filter options based on data type
  const filterOptions = {
    financial: [
      { id: "revenue", label: "Revenue" },
      { id: "expenses", label: "Expenses" },
      { id: "profit", label: "Profit" },
      { id: "growth", label: "Growth Rate" },
    ],
    market: [
      { id: "market_share", label: "Market Share" },
      { id: "competitors", label: "Competitors" },
      { id: "trends", label: "Market Trends" },
      { id: "regions", label: "Regions" },
    ],
    performance: [
      { id: "speed", label: "Speed" },
      { id: "reliability", label: "Reliability" },
      { id: "usability", label: "Usability" },
      { id: "features", label: "Features" },
    ],
    demographic: [
      { id: "age", label: "Age Groups" },
      { id: "gender", label: "Gender" },
      { id: "location", label: "Location" },
      { id: "income", label: "Income Level" },
    ],
  }

  // Reset filters when data type changes
  useEffect(() => {
    // Only reset filters when dataType changes, not on initial render
    if (selectedFilters.length > 0) {
      setSelectedFilters([])
      onFilterChange([])
    }
  }, [dataType])

  const currentFilters = filterOptions[dataType as keyof typeof filterOptions] || []

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters((prev) => {
      const newFilters = prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]

      onFilterChange(newFilters)
      return newFilters
    })
  }

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-lg transition-all duration-300 hover:shadow-purple-900/20">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5 text-purple-400" />
        <span>Data Filters</span>
      </h2>

      <div className="space-y-3">
        {currentFilters.map((filter) => (
          <div key={filter.id} className="flex items-center space-x-2">
            <Checkbox
              id={filter.id}
              checked={selectedFilters.includes(filter.id)}
              onCheckedChange={() => handleFilterToggle(filter.id)}
              className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <Label htmlFor={filter.id} className="text-white/80 text-sm cursor-pointer">
              {filter.label}
            </Label>
          </div>
        ))}

        {selectedFilters.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center text-xs text-white/60">
            <Check className="h-3 w-3 mr-1 text-purple-400" />
            <span>
              {selectedFilters.length} filter{selectedFilters.length !== 1 ? "s" : ""} applied
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
