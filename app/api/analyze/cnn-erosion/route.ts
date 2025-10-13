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

    // Simulate CNN erosion detection
    // In production, this would process the actual image through PyTorch model
    const erosionLevels = ["none", "minimal", "moderate", "severe", "critical"]
    const randomLevel = erosionLevels[Math.floor(Math.random() * erosionLevels.length)]
    const confidence = 0.75 + Math.random() * 0.2

    const probabilities = erosionLevels.reduce(
      (acc, level) => {
        acc[level] = Math.random()
        return acc
      },
      {} as Record<string, number>,
    )

    // Normalize probabilities
    const sum = Object.values(probabilities).reduce((a, b) => a + b, 0)
    Object.keys(probabilities).forEach((key) => {
      probabilities[key] = probabilities[key] / sum
    })

    const predictionData = {
      model_type: "cnn_erosion_detector",
      erosion_level: randomLevel,
      probabilities: probabilities,
      detected_features: ["gully_formation", "soil_displacement", "bare_soil_patches"],
    }

    // Save to database
    const { data: analysisResult, error } = await supabase
      .from("analysis_results")
      .insert({
        image_id: imageId,
        user_id: user.id,
        model_type: "cnn_erosion",
        prediction_data: predictionData,
        confidence_score: confidence,
        erosion_detected: randomLevel !== "none",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      result: {
        erosion_detected: randomLevel !== "none",
        erosion_level: randomLevel,
        confidence: Math.round(confidence * 100) / 100,
        probabilities: probabilities,
        analysis_id: analysisResult.id,
      },
    })
  } catch (error) {
    console.error("[v0] CNN erosion analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
