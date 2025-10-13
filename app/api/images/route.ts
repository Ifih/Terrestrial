import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: images, error } = await supabase
      .from("satellite_images")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ images })
  } catch (error) {
    console.error("[v0] Fetch images error:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
