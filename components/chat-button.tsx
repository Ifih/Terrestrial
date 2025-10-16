"use client"

/**
 * A client component button that navigates the user to the AI chat page.
 * It uses the Next.js App Router's `useRouter` hook for client-side navigation.
 */
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export function ChatButton() {
  // useRouter hook provides access to the router instance for navigation.
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/chat")} className="bg-sky-600 hover:bg-sky-700">
      <MessageSquare className="mr-2 h-4 w-4" />
      Ask AI Assistant
    </Button>
  )
}
