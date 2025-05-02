"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DataTypePreviewCard } from "./data-type-preview-card"
import { dataTypeSamples } from "@/lib/utils/data-type-samples"
import { useAuth } from "@/lib/authContext"

export function DataTypePreviews() {
  const router = useRouter()
  const { user } = useAuth()
  const [userTier, setUserTier] = useState<"basic" | "pro" | "enterprise">("basic")
  
  // Handle upgrade button click
  const handleUpgrade = () => {
    router.push("/subscriptions")
  }
  
  // Get user's subscription tier from localStorage or other source
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTier = localStorage.getItem('userPlan')
      if (storedTier === 'pro') {
        setUserTier('pro')
      } else if (storedTier === 'enterprise') {
        setUserTier('enterprise')
      } else {
        setUserTier('basic')
      }
    }
  }, [])
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Data Types & Features</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Explore the different types of data you can extract with Galaxy Scraper.
          Your current plan: <span className="font-medium text-purple-400">{userTier.charAt(0).toUpperCase() + userTier.slice(1)}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dataTypeSamples.map((dataType) => (
          <DataTypePreviewCard
            key={dataType.type}
            data={dataType}
            userTier={userTier}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
    </div>
  )
}
