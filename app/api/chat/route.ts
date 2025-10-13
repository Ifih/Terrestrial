import { createClient } from "@/lib/supabase/server"
import { streamText } from "ai"
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

    const { messages, sessionId } = await request.json()

    // Create or get chat session
    let chatSessionId = sessionId
    if (!chatSessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          title: messages[0]?.content?.substring(0, 50) || "New Chat",
        })
        .select()
        .single()

      if (sessionError) throw sessionError
      chatSessionId = newSession.id
    }

    // Save user message
    await supabase.from("chat_messages").insert({
      session_id: chatSessionId,
      user_id: user.id,
      role: "user",
      content: messages[messages.length - 1].content,
    })

    // System prompt for land degradation context
    const systemPrompt = `You are an expert AI assistant specializing in land degradation, environmental science, and satellite imagery analysis. 

Your expertise includes:
- Soil erosion detection and prevention
- Vegetation loss and NDVI analysis
- Climate change impacts on land
- Sustainable land management practices
- Satellite imagery interpretation
- Machine learning models for environmental monitoring

When users ask about their analysis results, provide:
- Clear explanations of degradation levels and metrics
- Actionable recommendations for land restoration
- Context about environmental factors
- Scientific backing for your suggestions

Be concise, accurate, and helpful. Use technical terms when appropriate but explain them clearly.`

    const result = streamText({
      model: "google/gemini-2.0-flash-exp",
      system: systemPrompt,
      messages: messages,
      async onFinish({ text }) {
        // Save assistant response
        await supabase.from("chat_messages").insert({
          session_id: chatSessionId,
          user_id: user.id,
          role: "assistant",
          content: text,
        })
      },
    })

    return result.toDataStreamResponse({
      headers: {
        "X-Session-Id": chatSessionId,
      },
    })
  } catch (error) {
    console.error("[v0] Chat error:", error)
    return NextResponse.json({ error: "Chat failed" }, { status: 500 })
  }
}
