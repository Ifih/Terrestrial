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

    const { data: predictions, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ predictions })
  } catch (error) {
    console.error("[v0] Fetch predictions error:", error)
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 })
  }
}

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
    const { location_name, latitude, longitude, climate_scenario, predicted_for_year } = body

    // Simulate AI prediction generation
    const predictionData = {
      temperature_increase: Math.random() * 3 + 1,
      precipitation_change: (Math.random() - 0.5) * 40,
      soil_moisture_loss: Math.random() * 30,
      vegetation_decline: Math.random() * 50,
      erosion_risk_increase: Math.random() * 60,
      desertification_probability: Math.random() * 0.7,
      recommended_actions: [
        "Implement soil conservation measures",
        "Increase vegetation cover through reforestation",
        "Establish water retention systems",
        "Monitor soil health regularly",
      ],
      confidence: 0.85 + Math.random() * 0.1,
    }

    // Determine risk level based on prediction data
    const avgRisk =
      (predictionData.vegetation_decline + predictionData.erosion_risk_increase + predictionData.soil_moisture_loss) / 3
    let risk_level: "low" | "medium" | "high" | "critical"
    if (avgRisk < 20) risk_level = "low"
    else if (avgRisk < 40) risk_level = "medium"
    else if (avgRisk < 60) risk_level = "high"
    else risk_level = "critical"

    const { data: prediction, error } = await supabase
      .from("predictions")
      .insert({
        user_id: user.id,
        location_name,
        latitude,
        longitude,
        climate_scenario,
        prediction_data: predictionData,
        risk_level,
        predicted_for_year,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error("[v0] Create prediction error:", error)
    return NextResponse.json({ error: "Failed to create prediction" }, { status: 500 })
  }
}
