"use client"

import { LogOut, LogIn, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500 opacity-70 blur-sm"></div>
          <BarChart2 className="text-white relative z-10 h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Galaxy Data Analyzer
        </h1>
      </div>

      <Button
        variant="ghost"
        className="text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
        onClick={() => setIsLoggedIn(!isLoggedIn)}
      >
        {isLoggedIn ? (
          <>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </>
        )}
      </Button>
    </header>
  )
}
