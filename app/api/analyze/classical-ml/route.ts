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
    const { features, imageId } = body

    // Simulate classical ML prediction
    // In production, this would call the Python backend
    const ndvi = features.ndvi || 0.5
    const soilMoisture = features.soil_moisture || 50
    const temperature = features.temperature || 25
    const precipitation = features.precipitation || 100

    // Calculate degradation score
    const degradationScore =
      (1 - ndvi) * 0.4 + (1 - soilMoisture / 100) * 0.3 + (temperature / 40) * 0.2 + (1 - precipitation / 200) * 0.1

    let degradationLevel: string
    if (degradationScore < 0.2) degradationLevel = "none"
    else if (degradationScore < 0.4) degradationLevel = "low"
    else if (degradationScore < 0.6) degradationLevel = "moderate"
    else if (degradationScore < 0.8) degradationLevel = "high"
    else degradationLevel = "severe"

    const vegetationLoss = degradationScore * 100

    const predictionData = {
      model_type: "random_forest",
      features: features,
      degradation_score: degradationScore,
      feature_importance: {
        ndvi: 0.4,
        soil_moisture: 0.3,
        temperature: 0.2,
        precipitation: 0.1,
      },
    }

    // Save to database
    const { data: analysisResult, error } = await supabase
      .from("analysis_results")
      .insert({
        image_id: imageId,
        user_id: user.id,
        model_type: "classical_ml",
        prediction_data: predictionData,
        confidence_score: 0.85,
        degradation_level: degradationLevel,
        vegetation_loss_percentage: vegetationLoss,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      result: {
        degradation_level: degradationLevel,
        vegetation_loss_percentage: Math.round(vegetationLoss * 100) / 100,
        confidence: 0.85,
        prediction_data: predictionData,
        analysis_id: analysisResult.id,
      },
    })
  } catch (error) {
    console.error("[v0] Classical ML analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
