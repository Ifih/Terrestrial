"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface DegradationChartProps {
  analyses: any[]
}

export function DegradationChart({ analyses }: DegradationChartProps) {
  // Aggregate data by degradation level
  const data = [
    { level: "None", count: analyses.filter((a) => a.degradation_level === "none").length },
    { level: "Low", count: analyses.filter((a) => a.degradation_level === "low").length },
    { level: "Moderate", count: analyses.filter((a) => a.degradation_level === "moderate").length },
    { level: "High", count: analyses.filter((a) => a.degradation_level === "high").length },
    { level: "Severe", count: analyses.filter((a) => a.degradation_level === "severe").length },
  ]

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="text-emerald-900">Degradation Levels</CardTitle>
        <CardDescription className="text-emerald-700">Distribution of land degradation severity</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis dataKey="level" stroke="#047857" />
            <YAxis stroke="#047857" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #a7f3d0",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
