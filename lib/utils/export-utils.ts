import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

/**
 * Utility functions for exporting data in various formats
 */

// Get current date in YYYY-MM-DD format for filenames
const getFormattedDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Helper to ensure data is in the correct format for export
const prepareData = (data: any[]): any[] => {
  // Deep clone the data to avoid modifying the original
  const clonedData = JSON.parse(JSON.stringify(data));
  
  // Clean up data - handle nested objects, null values, etc.
  return clonedData.map((item: any) => {
    const cleanedItem: Record<string, any> = {};
    
    Object.keys(item).forEach(key => {
      // Skip functions and complex objects (keep only primitive values and simple objects)
      const value = item[key];
      if (value === null || value === undefined) {
        cleanedItem[key] = ''; // Convert null/undefined to empty string
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        cleanedItem[key] = JSON.stringify(value); // Convert objects to JSON string
      } else if (Array.isArray(value)) {
        cleanedItem[key] = value.join(', '); // Convert arrays to comma-separated strings
      } else {
        cleanedItem[key] = value; // Keep primitive values as is
      }
    });
    
    return cleanedItem;
  });
};

// Type for export options
export type ExportFormat = 'csv' | 'json' | 'excel' | 'pdf';

/**
 * Export data as CSV
 */
export const exportToCsv = (data: any[], filename: string = `scrape-results-${getFormattedDate()}.csv`): void => {
  try {
    if (!data || !data.length) {
      throw new Error('No data to export');
    }
    
    // Prepare the data
    const exportData = prepareData(data);
    
    // Get headers from the first object
    const headers = Object.keys(exportData[0]);
    
    // Create CSV rows
    const csvRows = [
      // Headers row
      headers.join(','),
      // Data rows
      ...exportData.map(row => 
        headers.map(header => {
          // Handle values that contain commas, quotes, or newlines
          const cell = String(row[header] || '');
          // Quote the value if it contains commas, quotes, or newlines
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      )
    ];
    
    // Combine rows into a single CSV string
    const csvString = csvRows.join('\n');
    
    // Create a blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

/**
 * Export data as JSON
 */
export const exportToJson = (data: any[], filename: string = `scrape-results-${getFormattedDate()}.json`): void => {
  try {
    if (!data || !data.length) {
      throw new Error('No data to export');
    }
    
    // Prepare the data
    const exportData = prepareData(data);
    
    // Convert to JSON string with indentation for readability
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob and trigger download
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
};

/**
 * Export data as Excel (XLSX)
 */
export const exportToExcel = (data: any[], filename: string = `scrape-results-${getFormattedDate()}.xlsx`): void => {
  try {
    if (!data || !data.length) {
      throw new Error('No data to export');
    }
    
    // Prepare the data
    const exportData = prepareData(data);
    
    // Create a workbook and add a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scrape Results');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

/**
 * Export data as PDF
 */
export const exportToPdf = (data: any[], filename: string = `scrape-results-${getFormattedDate()}.pdf`): void => {
  try {
    if (!data || !data.length) {
      throw new Error('No data to export');
    }
    
    // Prepare the data
    const exportData = prepareData(data);
    
    // Get headers from the first object
    const headers = Object.keys(exportData[0]);
    
    // Create rows for PDF table
    const rows = exportData.map(row => headers.map(header => String(row[header] || '')));
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Scrape Results', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Add the table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      margin: { top: 30 },
      styles: { overflow: 'linebreak' },
      columnStyles: { 
        // Set width for columns if they contain a lot of text
        // This is a heuristic - adjust as needed
        ...headers.reduce((acc, header, index) => {
          // Check if this column typically contains long text
          const isLongTextColumn = exportData.some(row => 
            row[header] && String(row[header]).length > 50
          );
          
          if (isLongTextColumn) {
            acc[index] = { cellWidth: 40 };
          }
          return acc;
        }, {} as Record<number, { cellWidth: number }>)
      },
      headStyles: { 
        fillColor: [66, 66, 124],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { 
        fillColor: [245, 245, 255]
      }
    });
    
    // Save the PDF
    doc.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

/**
 * Main export function - handles all export formats
 */
export const exportData = (data: any[], format: ExportFormat, filename?: string): void => {
  try {
    const timestamp = getFormattedDate();
    
    let defaultFilename: string;
    switch (format) {
      case 'csv':
        defaultFilename = `scrape-results-${timestamp}.csv`;
        exportToCsv(data, filename || defaultFilename);
        break;
      case 'json':
        defaultFilename = `scrape-results-${timestamp}.json`;
        exportToJson(data, filename || defaultFilename);
        break;
      case 'excel':
        defaultFilename = `scrape-results-${timestamp}.xlsx`;
        exportToExcel(data, filename || defaultFilename);
        break;
      case 'pdf':
        defaultFilename = `scrape-results-${timestamp}.pdf`;
        exportToPdf(data, filename || defaultFilename);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error(`Error exporting data as ${format}:`, error);
    throw error;
  }
};
