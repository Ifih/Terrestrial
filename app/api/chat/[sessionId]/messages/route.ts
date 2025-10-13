import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Fetch messages error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
