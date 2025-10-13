import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ imageId: string }> }) {
  try {
    const { imageId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: results, error } = await supabase
      .from("analysis_results")
      .select("*")
      .eq("image_id", imageId)
      .eq("user_id", user.id)
      .order("analyzed_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ results })
  } catch (error) {
    console.error("[v0] Fetch analysis results error:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
