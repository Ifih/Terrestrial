import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ChatPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
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
          <h1 className="text-2xl font-bold text-emerald-900">AI Assistant</h1>
        </div>

        <ChatInterface />

        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <h3 className="mb-2 font-semibold text-emerald-900">Example Questions:</h3>
          <ul className="space-y-1 text-sm text-emerald-700">
            <li>• What does a degradation level of &quot;moderate&quot; mean for my land?</li>
            <li>• How can I interpret NDVI values in vegetation analysis?</li>
            <li>• What are the best practices for preventing soil erosion?</li>
            <li>• Explain the difference between erosion detection and vegetation loss analysis</li>
            <li>• What restoration strategies work best for severely degraded land?</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
