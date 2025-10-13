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

    // Simulate CNN vegetation loss detection
    const vegetationLoss = Math.random() * 80
    const ndvi = 0.2 + Math.random() * 0.6

    let severity: string
    if (vegetationLoss < 10) severity = "minimal"
    else if (vegetationLoss < 30) severity = "moderate"
    else if (vegetationLoss < 60) severity = "significant"
    else severity = "severe"

    const predictionData = {
      model_type: "cnn_vegetation_loss",
      vegetation_loss_percentage: vegetationLoss,
      ndvi: ndvi,
      severity: severity,
      health_status: vegetationLoss < 20 ? "healthy" : "degraded",
      detected_changes: ["canopy_reduction", "biomass_loss", "chlorophyll_decline"],
    }

    // Save to database
    const { data: analysisResult, error } = await supabase
      .from("analysis_results")
      .insert({
        image_id: imageId,
        user_id: user.id,
        model_type: "cnn_vegetation",
        prediction_data: predictionData,
        confidence_score: 0.88,
        vegetation_loss_percentage: vegetationLoss,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      result: {
        vegetation_loss_percentage: Math.round(vegetationLoss * 100) / 100,
        ndvi: Math.round(ndvi * 1000) / 1000,
        severity: severity,
        health_status: vegetationLoss < 20 ? "healthy" : "degraded",
        confidence: 0.88,
        analysis_id: analysisResult.id,
      },
    })
  } catch (error) {
    console.error("[v0] CNN vegetation analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
