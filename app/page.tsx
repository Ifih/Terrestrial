import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Satellite, Brain, TrendingUp, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Satellite className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-900">Land Degradation Monitor</span>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-emerald-900 text-balance">
            AI-Powered Land Degradation Monitoring
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-emerald-700 text-pretty">
            Leverage advanced AI and satellite imagery to detect, analyze, and mitigate land degradation. Protect our
            planet with cutting-edge technology.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Start Analyzing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-emerald-200">
            <CardHeader>
              <Satellite className="mb-2 h-10 w-10 text-emerald-600" />
              <CardTitle className="text-emerald-900">Satellite Analysis</CardTitle>
              <CardDescription className="text-emerald-700">
                Upload and analyze satellite imagery for early detection of soil erosion and vegetation loss
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <Brain className="mb-2 h-10 w-10 text-teal-600" />
              <CardTitle className="text-emerald-900">AI Models</CardTitle>
              <CardDescription className="text-emerald-700">
                Classical ML and deep learning CNNs for comprehensive land degradation assessment
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <TrendingUp className="mb-2 h-10 w-10 text-cyan-600" />
              <CardTitle className="text-emerald-900">Predictions</CardTitle>
              <CardDescription className="text-emerald-700">
                Forecast future degradation scenarios under various climate conditions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <MessageSquare className="mb-2 h-10 w-10 text-blue-600" />
              <CardTitle className="text-emerald-900">AI Assistant</CardTitle>
              <CardDescription className="text-emerald-700">
                Get expert advice and natural language explanations powered by Gemini 2.5
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Technology Stack */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-emerald-900">Powered by Advanced AI</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="text-emerald-900">Classical ML</CardTitle>
                <CardDescription className="text-emerald-700">
                  Scikit-learn based Random Forest models for regression and classification on labeled datasets
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-teal-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="text-emerald-900">Deep Learning</CardTitle>
                <CardDescription className="text-emerald-700">
                  PyTorch CNN models for satellite image analysis, erosion detection, and vegetation loss assessment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-cyan-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-emerald-900">Gemini 2.5</CardTitle>
                <CardDescription className="text-emerald-700">
                  Transfer learning for segmentation and LLM integration for natural language explanations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
