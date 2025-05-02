"use client"

import type React from "react"

import { useState } from "react"
import { Database, ChevronDown, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DataSourcePanelProps {
  onAnalyze: (source: string, dataType: string) => void
  isLoading: boolean
}

export function DataSourcePanel({ onAnalyze, isLoading }: DataSourcePanelProps) {
  const [source, setSource] = useState("")
  const [dataType, setDataType] = useState("financial")

  const dataTypes = [
    { id: "financial", name: "Financial Data" },
    { id: "market", name: "Market Analysis" },
    { id: "performance", name: "Performance Metrics" },
    { id: "demographic", name: "Demographic Data" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (source.trim()) {
      onAnalyze(source, dataType)
    }
  }

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-lg transition-all duration-300 hover:shadow-purple-900/20">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Database className="h-5 w-5 text-purple-400" />
        <span>Data Source</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="source" className="text-white/80 text-sm">
            Data Source URL or Connection String
          </Label>
          <Input
            id="source"
            type="text"
            placeholder="Enter data source..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50 h-10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataType" className="text-white/80 text-sm">
            Data Type
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="dataType"
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-10 w-full justify-between"
              >
                {dataTypes.find((dt) => dt.id === dataType)?.name}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900/90 backdrop-blur-md border-white/10">
              {dataTypes.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  className="text-white hover:bg-white/10 cursor-pointer"
                  onClick={() => setDataType(type.id)}
                >
                  {type.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-10 w-full transition-all duration-300 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Analyze Data</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
