import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/authContext'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'React App with Auth & Stripe',
  description: 'A React application with authentication and Stripe integration',
  generator: 'v0.dev',
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
