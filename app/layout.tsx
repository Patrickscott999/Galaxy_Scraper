import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/authContext'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Galaxy Scraper | AI-Powered Web Data Extraction',
  description: 'Extract, analyze, and enrich web data with AI-powered insights and multi-format exports',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
