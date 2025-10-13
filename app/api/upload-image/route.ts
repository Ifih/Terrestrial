import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const locationName = formData.get("locationName") as string
    const latitude = formData.get("latitude") as string
    const longitude = formData.get("longitude") as string
    const captureDate = formData.get("captureDate") as string
    const imageType = formData.get("imageType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // In production, upload to Vercel Blob or Supabase Storage
    // For now, we'll use a placeholder URL
    const imageUrl = `/placeholder.svg?height=400&width=600&query=satellite+imagery+${locationName}`

    // Save image metadata to database
    const { data: imageData, error } = await supabase
      .from("satellite_images")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        location_name: locationName,
        latitude: latitude ? Number.parseFloat(latitude) : null,
        longitude: longitude ? Number.parseFloat(longitude) : null,
        capture_date: captureDate || null,
        image_type: imageType || "rgb",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      image: imageData,
    })
  } catch (error) {
    console.error("[v0] Image upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
