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

    const body = await request.json()
    const { imageId, imageUrl } = body

    // Simulate segmentation using Gemini 2.5 (transfer learning)
    const segments = {
      healthy_vegetation: Math.random() * 40 + 20,
      degraded_land: Math.random() * 30 + 10,
      bare_soil: Math.random() * 20 + 5,
      water_bodies: Math.random() * 10,
      urban_areas: Math.random() * 15,
    }

    // Normalize to 100%
    const total = Object.values(segments).reduce((a, b) => a + b, 0)
    Object.keys(segments).forEach((key) => {
      segments[key as keyof typeof segments] = (segments[key as keyof typeof segments] / total) * 100
    })

    const degradationLevel =
      segments.degraded_land + segments.bare_soil > 50
        ? "high"
        : segments.degraded_land + segments.bare_soil > 30
          ? "moderate"
          : "low"

    const predictionData = {
      model_type: "gemini_segmentation",
      segments: segments,
      total_degraded_area: segments.degraded_land + segments.bare_soil,
      analysis_method: "transfer_learning",
    }

    // Save to database
    const { data: analysisResult, error } = await supabase
      .from("analysis_results")
      .insert({
        image_id: imageId,
        user_id: user.id,
        model_type: "segmentation",
        prediction_data: predictionData,
        confidence_score: 0.92,
        degradation_level: degradationLevel,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      result: {
        segments: Object.fromEntries(Object.entries(segments).map(([k, v]) => [k, Math.round(v * 100) / 100])),
        degradation_level: degradationLevel,
        total_degraded_area: Math.round((segments.degraded_land + segments.bare_soil) * 100) / 100,
        confidence: 0.92,
        analysis_id: analysisResult.id,
      },
    })
  } catch (error) {
    console.error("[v0] Segmentation analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
