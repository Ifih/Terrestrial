"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PredictionForm } from "@/components/prediction-form"
import { ArrowLeft, TrendingUp, Droplets, Thermometer, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Prediction {
  id: string
  location_name: string
  latitude: number
  longitude: number
  climate_scenario: string
  prediction_data: {
    temperature_increase: number
    precipitation_change: number
    soil_moisture_loss: number
    vegetation_decline: number
    erosion_risk_increase: number
    desertification_probability: number
    recommended_actions: string[]
    confidence: number
  }
  risk_level: "low" | "medium" | "high" | "critical"
  predicted_for_year: number
  created_at: string
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const response = await fetch("/api/predictions")
      if (!response.ok) throw new Error("Failed to fetch predictions")
      const { predictions } = await response.json()
      setPredictions(predictions)
    } catch (error) {
      console.error("[v0] Fetch predictions error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePredictionCreated = (prediction: Prediction) => {
    setLatestPrediction(prediction)
    setPredictions([prediction, ...predictions])
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-emerald-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low":
        return "default"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Climate Predictions</h1>
            <p className="text-sm text-emerald-700">AI-Powered Land Degradation Forecasting</p>
          </div>
          <Button
            variant="outline"
            asChild
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prediction Form */}
          <PredictionForm onPredictionCreated={handlePredictionCreated} />

          {/* Latest Prediction Results */}
          {latestPrediction && (
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-emerald-900">Prediction Results</CardTitle>
                  <Badge variant={getRiskBadgeVariant(latestPrediction.risk_level)} className="uppercase">
                    {latestPrediction.risk_level} Risk
                  </Badge>
                </div>
                <CardDescription className="text-emerald-700">
                  {latestPrediction.location_name} - Year {latestPrediction.predicted_for_year}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-emerald-900">
                        <Thermometer className="h-4 w-4" />
                        Temperature Increase
                      </span>
                      <span className="font-medium text-emerald-700">
                        +{latestPrediction.prediction_data.temperature_increase.toFixed(1)}°C
                      </span>
                    </div>
                    <Progress
                      value={(latestPrediction.prediction_data.temperature_increase / 5) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-emerald-900">
                        <Droplets className="h-4 w-4" />
                        Soil Moisture Loss
                      </span>
                      <span className="font-medium text-emerald-700">
                        {latestPrediction.prediction_data.soil_moisture_loss.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={latestPrediction.prediction_data.soil_moisture_loss} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-emerald-900">
                        <TrendingUp className="h-4 w-4" />
                        Vegetation Decline
                      </span>
                      <span className="font-medium text-emerald-700">
                        {latestPrediction.prediction_data.vegetation_decline.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={latestPrediction.prediction_data.vegetation_decline} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-emerald-900">
                        <AlertTriangle className="h-4 w-4" />
                        Erosion Risk Increase
                      </span>
                      <span className="font-medium text-emerald-700">
                        {latestPrediction.prediction_data.erosion_risk_increase.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={latestPrediction.prediction_data.erosion_risk_increase} className="h-2" />
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-50 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-900">Recommended Actions</h4>
                  <ul className="space-y-1 text-sm text-emerald-700">
                    {latestPrediction.prediction_data.recommended_actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center text-sm text-emerald-700">
                  Confidence: {(latestPrediction.prediction_data.confidence * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Historical Predictions */}
        {predictions.length > 0 && (
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-900">Historical Predictions</CardTitle>
              <CardDescription className="text-emerald-700">Your previous climate scenario analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="flex items-center justify-between rounded-lg border border-emerald-200 bg-white p-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-900">{prediction.location_name}</h4>
                      <p className="text-sm text-emerald-700">
                        {prediction.climate_scenario.replace(/_/g, " ")} - Year {prediction.predicted_for_year}
                      </p>
                      <p className="text-xs text-emerald-600">
                        Created: {new Date(prediction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getRiskBadgeVariant(prediction.risk_level)} className="uppercase">
                      {prediction.risk_level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardHeader>
            <CardTitle>About Climate Predictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-emerald-50">
            <p>
              Our AI-powered prediction system analyzes multiple climate scenarios to forecast potential land
              degradation impacts. The models consider temperature changes, precipitation patterns, soil conditions, and
              vegetation health.
            </p>
            <p>
              Predictions are generated using machine learning algorithms trained on historical climate data and
              satellite imagery, providing actionable insights for land management and conservation planning.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
