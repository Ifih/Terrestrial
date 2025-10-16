import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Satellite,
  Brain,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Upload,
  Scan,
  BarChart3,
  Lightbulb,
  Code2,
  Database,
  Activity,
} from "lucide-react"
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
        <div
          className="mb-16 text-center relative rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `url('/satellite-view-of-earth-terrain-with-forests-and-a.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-900/80 to-cyan-900/85" />

          {/* Content */}
          <div className="relative z-10 py-24 px-6">
            <h1 className="mb-4 text-5xl font-bold text-white text-balance drop-shadow-lg">
              AI-Powered Land Degradation Monitoring
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-emerald-50 text-pretty drop-shadow-md">
              Leverage advanced AI and satellite imagery to detect, analyze, and mitigate land degradation. Protect our
              planet with cutting-edge technology.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 shadow-xl">
                Start Analyzing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-4 text-center text-3xl font-bold text-emerald-900">How It Works</h2>
          <p className="mb-12 text-center text-emerald-700 text-lg">
            Four simple steps to analyze and protect your land
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                  <Upload className="h-8 w-8" />
                </div>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold text-emerald-900">Upload Imagery</h3>
                <p className="text-emerald-700">
                  Upload satellite images of your land area with location and date information
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">
                  <Scan className="h-8 w-8" />
                </div>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold text-emerald-900">AI Analysis</h3>
                <p className="text-emerald-700">
                  Our AI models analyze the imagery using ML and deep learning to detect degradation
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold text-emerald-900">View Results</h3>
                <p className="text-emerald-700">
                  Get detailed reports with degradation levels, erosion risk, and vegetation health
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  4
                </div>
                <h3 className="mb-2 text-xl font-semibold text-emerald-900">Take Action</h3>
                <p className="text-emerald-700">
                  Receive AI-powered recommendations and predictions for land management strategies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
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

          <Card className="border-emerald-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <Code2 className="mb-2 h-10 w-10 text-orange-600" />
              <CardTitle className="text-emerald-900">Python for Data Analysis</CardTitle>
              <CardDescription className="text-emerald-700">
                Implementation of Python-based tools for real-time data processing and trend analysis in various
                ecosystems
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
        </div>

        <div className="grid gap-6 md:grid-cols-1 mb-16">
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

      <footer className="border-t border-emerald-200 bg-white/80 backdrop-blur-sm mt-16">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Satellite className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-bold text-emerald-900">Land Degradation Monitor</span>
              </div>
              <p className="text-sm text-emerald-700">
                AI-powered platform for monitoring and mitigating land degradation worldwide.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-emerald-900">Platform</h3>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li>
                  <Link href="/auth/sign-up" className="hover:text-emerald-900 transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-emerald-900 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-emerald-900 transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-emerald-900">Features</h3>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex items-center gap-2">
                  <Satellite className="h-4 w-4" />
                  Satellite Analysis
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Models
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Predictions
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI Assistant
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-emerald-900">Technology</h3>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Machine Learning
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Deep Learning
                </li>
                <li className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Python Analysis
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-emerald-200 pt-8 text-center text-sm text-emerald-700">
            <p>&copy; {new Date().getFullYear()} Land Degradation Monitor. All rights reserved.</p>
            <p className="mt-2">Powered by AI • Built for a sustainable future</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
