"use client"

import { useState } from "react"
import { Download, File, FileText, FileSpreadsheet, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportData, ExportFormat } from "@/lib/utils/export-utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface ExportOptionsProps {
  data: any[]
  disabled?: boolean
}

export function ExportOptions({ data, disabled = false }: ExportOptionsProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    if (disabled || data.length === 0) return

    setIsExporting(true)
    try {
      await exportData(data, format)
      
      toast({
        title: "Export Successful",
        description: `Your data has been exported as ${format.toUpperCase()} format.`,
        variant: "default",
      })
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error)
      
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An error occurred during export",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled || data.length === 0 || isExporting}>
        <Button
          variant="outline"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          disabled={disabled || data.length === 0 || isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-white/10 text-white">
        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          className="hover:bg-white/10 cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2 text-green-400" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("json")}
          className="hover:bg-white/10 cursor-pointer"
        >
          <File className="h-4 w-4 mr-2 text-blue-400" />
          JSON
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          className="hover:bg-white/10 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-400" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="hover:bg-white/10 cursor-pointer"
        >
          <File className="h-4 w-4 mr-2 text-red-400" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
