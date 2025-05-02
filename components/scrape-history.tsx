"use client"

import { useState } from "react"
import { ChevronDown, Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function ScrapeHistory() {
  const [isOpen, setIsOpen] = useState(true)

  const historyItems = [
    { id: 1, url: "https://example.com/jobs", type: "Jobs", date: "2025-05-01 14:30", count: 42 },
    { id: 2, url: "https://example.com/products", type: "Prices", date: "2025-05-01 10:15", count: 128 },
    { id: 3, url: "https://example.com/news", type: "News", date: "2025-04-30 16:45", count: 17 },
    { id: 4, url: "https://example.com/realestate", type: "Real Estate", date: "2025-04-29 09:20", count: 56 },
  ]

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-purple-900/20"
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Scrape History</h2>
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
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <p className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">{item.url}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.count} results</span>
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
