"use client"

/**
 * A form for generating future land degradation predictions based on climate scenarios.
 * Users can input a location and select a scenario to forecast potential environmental changes.
 */
import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface PredictionFormProps {
  // Optional callback function to be executed when a prediction is successfully created.
  onPredictionCreated?: (prediction: any) => void
}

export function PredictionForm({ onPredictionCreated }: PredictionFormProps) {
  const [loading, setLoading] = useState(false)
  // State to hold all form data in a single object.
  const [formData, setFormData] = useState({
    location_name: "",
    latitude: "",
    longitude: "",
    climate_scenario: "",
    predicted_for_year: "2050",
  })

  // Handles form submission to the predictions API endpoint.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Convert string inputs to numbers before sending.
          ...formData,
          latitude: Number.parseFloat(formData.latitude),
          longitude: Number.parseFloat(formData.longitude),
          predicted_for_year: Number.parseInt(formData.predicted_for_year),
        }),
      })

      if (!response.ok) throw new Error("Failed to create prediction")

      const { prediction } = await response.json()
      // Trigger the callback if it was provided.
      onPredictionCreated?.(prediction)

      // Reset the form to its initial state after successful submission.
      setFormData({
        location_name: "",
        latitude: "",
        longitude: "",
        climate_scenario: "",
        predicted_for_year: "2050",
      })
    } catch (error) {
      console.error("[v0] Prediction error:", error)
      alert("Failed to generate prediction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="text-emerald-900">Generate Climate Prediction</CardTitle>
        <CardDescription className="text-emerald-700">
          Forecast land degradation under different climate scenarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location_name" className="text-emerald-900">
              Location Name
            </Label>
            <Input
              id="location_name"
              placeholder="e.g., Sahel Region, West Africa"
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              required
              className="border-emerald-300 focus:border-emerald-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-emerald-900">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                placeholder="e.g., 14.5"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
                className="border-emerald-300 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-emerald-900">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                placeholder="e.g., -14.5"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
                className="border-emerald-300 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="climate_scenario" className="text-emerald-900">
              Climate Scenario
            </Label>
            <Select
              value={formData.climate_scenario}
              onValueChange={(value) => setFormData({ ...formData, climate_scenario: value })}
              required
            >
              <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_trends">Current Trends (Business as Usual)</SelectItem>
                <SelectItem value="moderate_warming">Moderate Warming (+2°C)</SelectItem>
                <SelectItem value="high_warming">High Warming (+4°C)</SelectItem>
                <SelectItem value="drought_stress">Increased Drought Stress</SelectItem>
                <SelectItem value="extreme_weather">Extreme Weather Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="predicted_for_year" className="text-emerald-900">
              Prediction Year
            </Label>
            <Select
              value={formData.predicted_for_year}
              onValueChange={(value) => setFormData({ ...formData, predicted_for_year: value })}
              required
            >
              <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2030">2030</SelectItem>
                <SelectItem value="2040">2040</SelectItem>
                <SelectItem value="2050">2050</SelectItem>
                <SelectItem value="2075">2075</SelectItem>
                <SelectItem value="2100">2100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Prediction...
              </>
            ) : (
              "Generate Prediction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
