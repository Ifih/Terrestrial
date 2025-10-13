import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export async function RecentAnalyses() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch recent images with their analyses
  const { data: images } = await supabase
    .from("satellite_images")
    .select(
      `
      *,
      analysis_results (*)
    `,
    )
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false })
    .limit(6)

  if (!images || images.length === 0) {
    return (
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-900">Recent Analyses</CardTitle>
          <CardDescription className="text-emerald-700">Your latest satellite image analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-emerald-700">No analyses yet. Upload an image to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="text-emerald-900">Recent Analyses</CardTitle>
        <CardDescription className="text-emerald-700">Your latest satellite image analyses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image: any) => {
            const analysisCount = image.analysis_results?.length || 0
            const latestAnalysis = image.analysis_results?.[0]

            return (
              <Card key={image.id} className="border-emerald-200">
                <CardContent className="p-4">
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.location_name}
                    width={300}
                    height={200}
                    className="mb-3 h-32 w-full rounded-lg border border-emerald-200 object-cover"
                  />
                  <h3 className="mb-2 font-semibold text-emerald-900">{image.location_name}</h3>
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                      {analysisCount} {analysisCount === 1 ? "analysis" : "analyses"}
                    </Badge>
                    {latestAnalysis?.degradation_level && (
                      <Badge
                        className={
                          latestAnalysis.degradation_level === "high" || latestAnalysis.degradation_level === "severe"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {latestAnalysis.degradation_level}
                      </Badge>
                    )}
                  </div>
                  <Link href={`/analysis/${image.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-emerald-300 text-emerald-700 bg-transparent"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
