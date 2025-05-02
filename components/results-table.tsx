"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ExportOptions } from "./export-options"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ResultsTableProps {
  data: any[]
  isLoading: boolean
}

export function ResultsTable({ data, isLoading }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Get column headers from the first item in data
  const columns = data.length > 0 ? Object.keys(data[0]) : []

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

  // Export functionality is now handled by the ExportOptions component

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-lg transition-all duration-300 hover:shadow-purple-900/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Live Scrape Results</h2>

        <ExportOptions data={data} disabled={isLoading} />
      </div>

      <div className="rounded-lg overflow-hidden border border-white/10">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="text-white font-medium">
                  {column.charAt(0).toUpperCase() + column.slice(1).replace("_", " ")}
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
                  No data available. Enter a URL and click "Scrape Now" to begin.
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
