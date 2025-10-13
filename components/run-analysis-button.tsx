"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface RunAnalysisButtonProps {
  imageId: string
  imageUrl: string
}

export function RunAnalysisButton({ imageId, imageUrl }: RunAnalysisButtonProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentModel, setCurrentModel] = useState("")
  const router = useRouter()

  const runAnalysis = async () => {
    setIsRunning(true)

    try {
      // Run Classical ML
      setCurrentModel("Classical ML")
      await fetch("/api/analyze/classical-ml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId,
          features: {
            ndvi: 0.4,
            soil_moisture: 35,
            temperature: 32,
            precipitation: 75,
          },
        }),
      })

      // Run CNN Erosion Detection
      setCurrentModel("CNN Erosion Detection")
      await fetch("/api/analyze/cnn-erosion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, imageUrl }),
      })

      // Run CNN Vegetation Loss
      setCurrentModel("CNN Vegetation Loss")
      await fetch("/api/analyze/cnn-vegetation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, imageUrl }),
      })

      // Run Segmentation
      setCurrentModel("AI Segmentation")
      await fetch("/api/analyze/segmentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, imageUrl }),
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Analysis error:", error)
    } finally {
      setIsRunning(false)
      setCurrentModel("")
    }
  }

  return (
    <Button onClick={runAnalysis} disabled={isRunning} className="w-full bg-emerald-600 hover:bg-emerald-700">
      {isRunning ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Running {currentModel}...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Run All AI Models
        </>
      )}
    </Button>
  )
}
