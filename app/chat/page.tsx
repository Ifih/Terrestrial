/**
 * A server component that renders the main AI chat page.
 * It ensures the user is authenticated before displaying the chat interface.
 */
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ChatPage() {
  // Create a Supabase client for server-side operations.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If the user is not authenticated, redirect them to the login page.
  if (!user) redirect("/auth/login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-sky-900">AI Assistant</h1>
        </div>

        <ChatInterface />

        <div className="rounded-lg border border-sky-200 bg-white p-4">
          <h3 className="mb-2 font-semibold text-sky-900">Example Questions:</h3>
          <ul className="space-y-1 text-sm text-sky-700">
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
