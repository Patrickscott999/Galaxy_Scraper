"use client"

import type React from "react"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface UrlInputPanelProps {
  onScrape: (url: string, dataType: string) => void
  isLoading: boolean
}

export function UrlInputPanel({ onScrape, isLoading }: UrlInputPanelProps) {
  const [url, setUrl] = useState("")
  const [dataType, setDataType] = useState("Jobs")

  const dataTypes = ["Jobs", "Prices", "News", "Real Estate"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onScrape(url, dataType.toLowerCase().replace(" ", "_"))
    }
  }

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-lg transition-all duration-300 hover:shadow-purple-900/20">
      <h2 className="text-xl font-semibold text-white mb-4">URL Input Panel</h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Enter URL to scrape..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12"
            required
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12 w-full md:w-auto justify-between"
            >
              {dataType}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-900/90 backdrop-blur-md border-white/10">
            {dataTypes.map((type) => (
              <DropdownMenuItem
                key={type}
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => setDataType(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 px-6 transition-all duration-300 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>Scraping...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Scrape Now</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
