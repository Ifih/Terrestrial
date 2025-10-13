import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnalysisCard } from "@/components/analysis-card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RunAnalysisButton } from "@/components/run-analysis-button"

export default async function AnalysisPage({ params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Fetch image details
  const { data: image, error: imageError } = await supabase
    .from("satellite_images")
    .select("*")
    .eq("id", imageId)
    .eq("user_id", user.id)
    .single()

  if (imageError || !image) redirect("/dashboard")

  // Fetch analysis results
  const { data: results } = await supabase
    .from("analysis_results")
    .select("*")
    .eq("image_id", imageId)
    .eq("user_id", user.id)
    .order("analyzed_at", { ascending: false })

  const classicalMlResult = results?.find((r) => r.model_type === "classical_ml")
  const erosionResult = results?.find((r) => r.model_type === "cnn_erosion")
  const vegetationResult = results?.find((r) => r.model_type === "cnn_vegetation")
  const segmentationResult = results?.find((r) => r.model_type === "segmentation")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900">Satellite Image Analysis</CardTitle>
            <CardDescription className="text-emerald-700">{image.location_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Image
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.location_name}
                  width={600}
                  height={400}
                  className="rounded-lg border-2 border-emerald-200"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {image.latitude && (
                    <div>
                      <span className="font-medium text-emerald-900">Latitude:</span>
                      <span className="ml-2 text-emerald-700">{image.latitude}</span>
                    </div>
                  )}
                  {image.longitude && (
                    <div>
                      <span className="font-medium text-emerald-900">Longitude:</span>
                      <span className="ml-2 text-emerald-700">{image.longitude}</span>
                    </div>
                  )}
                  {image.capture_date && (
                    <div>
                      <span className="font-medium text-emerald-900">Capture Date:</span>
                      <span className="ml-2 text-emerald-700">{new Date(image.capture_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-emerald-900">Image Type:</span>
                    <span className="ml-2 text-emerald-700 capitalize">{image.image_type}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-900">Run AI Analysis</h3>
                <p className="text-sm text-emerald-700">
                  Analyze this satellite image using multiple AI models to detect land degradation, erosion, and
                  vegetation loss.
                </p>
                <RunAnalysisButton imageId={imageId} imageUrl={image.image_url} />
              </div>
            </div>
          </CardContent>
        </Card>

        {results && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-emerald-900">Analysis Results</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {classicalMlResult && (
                <AnalysisCard
                  title="Classical ML Analysis"
                  type="classical_ml"
                  result={{
                    degradation_level: classicalMlResult.degradation_level,
                    vegetation_loss_percentage: classicalMlResult.vegetation_loss_percentage,
                    confidence: classicalMlResult.confidence_score,
                  }}
                />
              )}
              {erosionResult && (
                <AnalysisCard
                  title="CNN Erosion Detection"
                  type="cnn_erosion"
                  result={{
                    erosion_detected: erosionResult.erosion_detected,
                    erosion_level: (erosionResult.prediction_data as any).erosion_level,
                    confidence: erosionResult.confidence_score,
                    probabilities: (erosionResult.prediction_data as any).probabilities,
                  }}
                />
              )}
              {vegetationResult && (
                <AnalysisCard
                  title="CNN Vegetation Loss"
                  type="cnn_vegetation"
                  result={{
                    vegetation_loss_percentage: vegetationResult.vegetation_loss_percentage,
                    ndvi: (vegetationResult.prediction_data as any).ndvi,
                    severity: (vegetationResult.prediction_data as any).severity,
                    health_status: (vegetationResult.prediction_data as any).health_status,
                    confidence: vegetationResult.confidence_score,
                  }}
                />
              )}
              {segmentationResult && (
                <AnalysisCard
                  title="AI Segmentation (Gemini 2.5)"
                  type="segmentation"
                  result={{
                    segments: (segmentationResult.prediction_data as any).segments,
                    total_degraded_area: (segmentationResult.prediction_data as any).total_degraded_area,
                    degradation_level: segmentationResult.degradation_level,
                    confidence: segmentationResult.confidence_score,
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
