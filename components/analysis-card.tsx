"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, TrendingDown, Leaf } from "lucide-react"

interface AnalysisCardProps {
  title: string
  type: "classical_ml" | "cnn_erosion" | "cnn_vegetation" | "segmentation"
  result: any
}

export function AnalysisCard({ title, type, result }: AnalysisCardProps) {
  const getIcon = () => {
    switch (type) {
      case "classical_ml":
        return <TrendingDown className="h-5 w-5 text-emerald-600" />
      case "cnn_erosion":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "cnn_vegetation":
        return <Leaf className="h-5 w-5 text-green-600" />
      case "segmentation":
        return <CheckCircle2 className="h-5 w-5 text-teal-600" />
    }
  }

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "none":
      case "minimal":
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "high":
      case "significant":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "severe":
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-lg text-emerald-900">{title}</CardTitle>
          </div>
          {result.confidence && (
            <Badge variant="outline" className="border-emerald-300 text-emerald-700">
              {Math.round(result.confidence * 100)}% confidence
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === "classical_ml" && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Degradation Level</span>
                <Badge className={getSeverityColor(result.degradation_level)}>{result.degradation_level}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Vegetation Loss</span>
                <span className="text-sm text-emerald-700">{result.vegetation_loss_percentage}%</span>
              </div>
              <Progress value={result.vegetation_loss_percentage} className="h-2" />
            </div>
          </>
        )}

        {type === "cnn_erosion" && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Erosion Detected</span>
                <Badge className={result.erosion_detected ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                  {result.erosion_detected ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Erosion Level</span>
                <Badge className={getSeverityColor(result.erosion_level)}>{result.erosion_level}</Badge>
              </div>
            </div>
            {result.probabilities && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-emerald-900">Probability Distribution</span>
                {Object.entries(result.probabilities).map(([level, prob]) => (
                  <div key={level} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-700 capitalize">{level}</span>
                      <span className="text-emerald-700">{Math.round((prob as number) * 100)}%</span>
                    </div>
                    <Progress value={(prob as number) * 100} className="h-1" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {type === "cnn_vegetation" && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Vegetation Loss</span>
                <span className="text-sm text-emerald-700">{result.vegetation_loss_percentage}%</span>
              </div>
              <Progress value={result.vegetation_loss_percentage} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">NDVI</span>
                <span className="text-sm text-emerald-700">{result.ndvi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Severity</span>
                <Badge className={getSeverityColor(result.severity)}>{result.severity}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Health Status</span>
                <Badge
                  className={
                    result.health_status === "healthy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }
                >
                  {result.health_status}
                </Badge>
              </div>
            </div>
          </>
        )}

        {type === "segmentation" && (
          <>
            <div className="space-y-2">
              <span className="text-sm font-medium text-emerald-900">Land Cover Segmentation</span>
              {result.segments &&
                Object.entries(result.segments).map(([segment, percentage]) => (
                  <div key={segment} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-700 capitalize">{segment.replace(/_/g, " ")}</span>
                      <span className="text-emerald-700">{(percentage as number).toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage as number} className="h-1" />
                  </div>
                ))}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                <span className="text-sm font-medium text-emerald-900">Total Degraded Area</span>
                <span className="text-lg font-bold text-emerald-700">{result.total_degraded_area}%</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
