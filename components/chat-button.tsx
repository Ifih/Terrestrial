"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export function ChatButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/chat")} className="bg-emerald-600 hover:bg-emerald-700">
      <MessageSquare className="mr-2 h-4 w-4" />
      Ask AI Assistant
    </Button>
  )
}
