import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageUploadForm } from "@/components/image-upload-form"
import { ChatButton } from "@/components/chat-button"
import { RecentAnalyses } from "@/components/recent-analyses"
import { StatsOverview } from "@/components/stats-overview"
import { DegradationChart } from "@/components/degradation-chart"
import { LogOut, Upload, MessageSquare, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch statistics
  const { data: images } = await supabase.from("satellite_images").select("*").eq("user_id", user.id)

  const { data: analyses } = await supabase.from("analysis_results").select("*").eq("user_id", user.id)

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Land Degradation Monitor</h1>
            <p className="text-sm text-emerald-700">AI-Powered Environmental Analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-emerald-900">{profile?.full_name || user.email}</p>
              {profile?.organization && <p className="text-xs text-emerald-700">{profile.organization}</p>}
            </div>
            <form action={handleSignOut}>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Image
              </CardTitle>
              <CardDescription className="text-emerald-50">Analyze satellite imagery with AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" asChild>
                <a href="#upload">Get Started</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <CardDescription className="text-teal-50">Get expert advice on land management</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatButton />
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictions
              </CardTitle>
              <CardDescription className="text-cyan-50">Forecast future degradation scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" asChild>
                <a href="/predictions">View Predictions</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Overview */}
        <StatsOverview totalImages={images?.length || 0} totalAnalyses={analyses?.length || 0} />

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <DegradationChart analyses={analyses || []} />
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-900">Analysis Distribution</CardTitle>
              <CardDescription className="text-emerald-700">Breakdown by model type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Classical ML", count: analyses?.filter((a) => a.model_type === "classical_ml").length || 0 },
                  { name: "CNN Erosion", count: analyses?.filter((a) => a.model_type === "cnn_erosion").length || 0 },
                  {
                    name: "CNN Vegetation",
                    count: analyses?.filter((a) => a.model_type === "cnn_vegetation").length || 0,
                  },
                  {
                    name: "Segmentation",
                    count: analyses?.filter((a) => a.model_type === "segmentation").length || 0,
                  },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-900">{item.name}</span>
                    <span className="text-2xl font-bold text-emerald-600">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <RecentAnalyses />

        {/* Upload Form */}
        <div id="upload">
          <ImageUploadForm />
        </div>
      </main>
    </div>
  )
}
