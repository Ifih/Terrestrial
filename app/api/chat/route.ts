/**
 * API route for handling AI chat requests.
 * This route uses the Vercel AI SDK to stream responses from Google's Gemini model.
 * It authenticates users, manages chat sessions, and persists messages to a Supabase database.
 */
import { createClient } from "@/lib/supabase/edge"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamText, convertToCoreMessages } from "ai"

// Specifies the Vercel Edge Runtime, which is required for streaming responses
// and provides lower latency and better scalability.
export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Request body:", body)
    const { messages, sessionId } = body

    // Validate that messages is provided and is an array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log("Validation failed: messages =", messages)
      return new Response("Invalid request: messages must be a non-empty array", { status: 400 })
    }

    // Filter out invalid messages (must have role and content)
    const validMessages = messages.filter(msg => msg && typeof msg === 'object' && msg.role && msg.content)
    if (validMessages.length === 0) {
      console.log("Validation failed: no valid messages after filtering")
      return new Response("Invalid request: no valid messages", { status: 400 })
    }

    // Convert messages to CoreMessages format
    const modelMessages = validMessages.map(msg => {
      const content = typeof msg.content === 'string' ? [{ type: 'text', text: msg.content }] : msg.content
      return {
        role: msg.role,
        content,
        ...(msg.name && { name: msg.name }),
      }
    })

    // Create a Supabase client to interact with the database.
    // This uses the edge-compatible client for this runtime. Await the
    // factory since it captures the cookie store.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Defines the system prompt to provide context and instructions to the AI model.
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

  // create a provider instance (the package exports a factory)
  const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY || "" })

    // A promise that will resolve when the `onFinish` callback has completed its database operations.
    // This is passed to `waitUntil` to prevent the serverless function from terminating prematurely.
    let onFinishPromise: Promise<any> | undefined = undefined

    // Use the Vercel AI SDK's `streamText` function to get a streaming response from the AI model.
    // Try a flash model first and fall back to a pro model if unavailable.
    let result: any
    try {
      result = streamText({
        model: google("gemini-2.5-flash"),
        system: systemPrompt,
        messages: modelMessages,
        onFinish: async ({ text, toolCalls, toolResults, usage, finishReason }) => {
          // Use a promise to wait for the database operations to complete
          // before the serverless function terminates.
          onFinishPromise = (async () => {
            // Use the sessionId from the request or create a new one if it's a new chat.
            let currentSessionId = sessionId

            // If no session ID is provided, create a new chat session in the database.
            if (!currentSessionId) {
              const { data: newSession, error: sessionError } = await supabase
                .from("chat_sessions")
                .insert({
                  user_id: user.id,
                  title: (typeof modelMessages[0]?.content === 'string' ? modelMessages[0].content.substring(0, 50) : "New Chat"),
                })
                .select()
                .single()

              if (sessionError) throw sessionError
              currentSessionId = newSession.id
            }

            // Persist the user's message and the full assistant response to the database.
            await supabase.from("chat_messages").insert([
              {
                session_id: currentSessionId,
                user_id: user.id,
                role: "user",
                content: modelMessages[modelMessages.length - 1].content,
              },
              {
                session_id: currentSessionId,
                user_id: user.id,
                role: "assistant",
                content: text,
              },
            ])
          })()
        },
      })
    } catch (err) {
      // If model not available or provider failed, try pro model as fallback.
      console.warn("flash model failed, trying fallback pro model:", err)
      result = streamText({
        model: google("gemini-2.5-pro"),
        system: systemPrompt,
        messages: modelMessages,
        onFinish: async ({ text, toolCalls, toolResults, usage, finishReason }) => {
          onFinishPromise = (async () => {
            let currentSessionId = sessionId
            if (!currentSessionId) {
              const { data: newSession, error: sessionError } = await supabase
                .from("chat_sessions")
                .insert({
                  user_id: user.id,
                  title: (typeof modelMessages[0]?.content === 'string' ? modelMessages[0].content.substring(0, 50) : "New Chat"),
                })
                .select()
                .single()

              if (sessionError) throw sessionError
              currentSessionId = newSession.id
            }

            await supabase.from("chat_messages").insert([
              {
                session_id: currentSessionId,
                user_id: user.id,
                role: "user",
                content: modelMessages[modelMessages.length - 1].content,
              },
              {
                session_id: currentSessionId,
                user_id: user.id,
                role: "assistant",
                content: text,
              },
            ])
          })()
        },
      })
    }

    // Prefer provider helper to convert to a UI message stream response if available.
    try {
      if (typeof result?.toUIMessageStreamResponse === "function") {
        return result.toUIMessageStreamResponse({
          headers: { "X-Session-Id": sessionId },
          waitUntil: onFinishPromise,
        })
      }

      if (typeof result?.toAIStreamResponse === "function") {
        return result.toAIStreamResponse({
          headers: { "X-Session-Id": sessionId },
          waitUntil: onFinishPromise,
        })
      }
    } catch (e) {
      console.warn("stream helper failed, falling back to full-text response", e)
    }

    // Fallback: attempt to collect the full text and return as JSON so the client
    // still receives a response even if streaming helpers are unavailable.
    let fullText = ""
    try {
      if (typeof result?.all === "function") {
        fullText = await result.all()
      } else if (typeof result?.text === "function") {
        fullText = await result.text()
      } else if (result?.response) {
        fullText = await result.response.text()
      }
    } catch (err) {
      console.warn("failed to read full text from result", err)
    }

    // Ensure DB persistence continues in the background.
    if (onFinishPromise) {
      ;(globalThis as any).waitUntil?.(onFinishPromise)
    }

    return new Response(JSON.stringify({ text: fullText }), {
      headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
    })
  } catch (error) {
    console.error("[v0] Chat error:", error)
    // Return a generic error response if something goes wrong.
    return new Response("Chat failed", { status: 500 })
  }
}
