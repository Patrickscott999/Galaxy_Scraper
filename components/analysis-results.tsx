"use client"

import { useState } from "react"
import { Download, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AnalysisResultsProps {
  data: any[]
  isLoading: boolean
  activeFilters: string[]
}

export function AnalysisResults({ data, isLoading, activeFilters }: AnalysisResultsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const itemsPerPage = 5

  // Get column headers from the first item in data
  const columns = data.length > 0 ? Object.keys(data[0]) : []

  // Sort data if sortField is set
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    const aString = String(aValue).toLowerCase()
    const bString = String(bValue).toLowerCase()

    return sortDirection === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString)
  })

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const exportToCsv = () => {
    if (data.length === 0) return

    const headers = columns.join(",")
    const rows = data.map((item) => columns.map((col) => `"${item[col]}"`).join(","))
    const csv = [headers, ...rows].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analysis-results-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-lg transition-all duration-300 hover:shadow-purple-900/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Analysis Results</h2>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-9"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900/90 backdrop-blur-md border-white/10">
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                Show All Columns
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                Show Summary View
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                Show Detailed View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-9"
            onClick={exportToCsv}
            disabled={data.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-white/10">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="text-white font-medium cursor-pointer hover:bg-white/10"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.charAt(0).toUpperCase() + column.slice(1).replace(/_/g, " ")}
                    {sortField === column && (
                      <ArrowUpDown
                        className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""} transition-transform`}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  {Array.from({ length: columns.length || 4 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex} className="py-3">
                      <div className="h-4 bg-white/10 rounded"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={index} className="border-white/5 hover:bg-white/5 transition-colors">
                  {columns.map((column) => (
                    <TableCell key={column} className="text-white/80">
                      {row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length || 4} className="text-center text-white/50 py-8">
                  No data available. Select a data source and click "Analyze Data" to begin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-white/70 text-sm">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)} of {data.length} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8 w-8"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-white/70 text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8 w-8"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
