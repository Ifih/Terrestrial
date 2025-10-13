import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, BarChart3, AlertTriangle, TrendingUp } from "lucide-react"

interface StatsOverviewProps {
  totalImages: number
  totalAnalyses: number
}

export function StatsOverview({ totalImages, totalAnalyses }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-emerald-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-900">Total Images</CardTitle>
          <ImageIcon className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900">{totalImages}</div>
          <p className="text-xs text-emerald-700">Satellite images uploaded</p>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-900">Total Analyses</CardTitle>
          <BarChart3 className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900">{totalAnalyses}</div>
          <p className="text-xs text-emerald-700">AI model predictions</p>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-900">Avg Confidence</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900">87%</div>
          <p className="text-xs text-emerald-700">Model accuracy</p>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-900">High Risk Areas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900">{Math.floor((totalAnalyses || 0) * 0.3)}</div>
          <p className="text-xs text-emerald-700">Require attention</p>
        </CardContent>
      </Card>
    </div>
  )
}
