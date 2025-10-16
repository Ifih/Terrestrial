"use client";

/**
 * The main user interface for the AI Land Degradation Assistant.
 * This component handles message display, user input, and communication with the AI backend.
 */
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ChatInterface() {
  // The `useChat` hook from the Vercel AI SDK manages the chat state and API communication.
  // It provides the message history, a function to send messages, and the current status.
  // `useChat`'s option types may differ between SDK versions; cast to `any`
  // to allow passing a custom API path here.
  const { messages, sendMessage, status, error } = useChat(({ api: "/api/chat" } as any))

  // We manage the input field's state locally.
  const [input, setInput] = useState("")

  // A derived state to determine if the AI is currently processing a message.
  const isLoading = status !== "ready"

  // A ref to the scrollable area to automatically scroll to the latest message.
  const scrollRef = useRef<HTMLDivElement>(null)

  // This effect scrolls the chat window to the bottom whenever a new message is added.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="flex h-[600px] flex-col border-sky-200">
      <CardHeader className="border-b border-sky-200">
        <CardTitle className="flex items-center gap-2 text-sky-900">
          <Bot className="h-5 w-5 text-sky-600" />
          AI Land Degradation Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {/* Display a welcome message if the chat is empty. */}
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-2">
                  <Bot className="mx-auto h-12 w-12 text-sky-400" />
                  <p className="text-sm text-sky-700">
                    Ask me anything about land degradation, satellite imagery analysis, or environmental restoration.
                  </p>
                </div>
              </div>
            )}
            {/* Map over the messages and render them. */}
            {messages.map((message) => {
              // Helper function to extract text content from different message types
              // provided by the AI SDK (e.g., UIMessage with `parts` or ModelMessage with `content`).
              const getMessageText = (msg: any) => {
                if (msg == null) return ''
                if (typeof msg.content === 'string' && msg.content.length > 0) return msg.content
                if (Array.isArray(msg.parts)) {
                  return msg.parts
                    .map((p: any) => {
                      if (!p) return ''
                      if (p.type === 'text' && typeof p.text === 'string') return p.text
                      if ((p.type === 'text-delta' || p.type === 'reasoning-delta') && typeof p.delta === 'string') return p.delta
                      if (p.type === 'reasoning' && typeof p.text === 'string') return p.text
                      if (p.inputTextDelta && typeof p.inputTextDelta === 'string') return p.inputTextDelta
                      return ''
                    })
                    .filter(Boolean)
                    .join('')
                }
                return ''
              }

              const displayText = getMessageText(message)

              return (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100">
                    <Bot className="h-4 w-4 text-sky-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-sky-600 text-white"
                      : "bg-sky-50 text-sky-900 border border-sky-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayText}</p>
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            )})}
            {/* Show a loading indicator while the AI is generating a response. */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100">
                  <Bot className="h-4 w-4 text-sky-600" />
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                  <span className="text-sm text-sky-700">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        {/* The form for user input. */}
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (!input || !input.trim()) return
            // The `sendMessage` function can accept a string or an object.
            // This implementation robustly tries both to ensure compatibility.
            console.debug("Chat submit: sending", input)
            try {
              // Prefer sending the raw input string.
              await (sendMessage as any)(input)
              console.debug("sendMessage accepted string payload")
            } catch (err) {
              try {
                // Fall back to sending a message object.
                await (sendMessage as any)({ role: "user", content: input })
                console.debug("sendMessage accepted object payload")
              } catch (err2) {
                console.error("sendMessage failed", err2)
              }
            }
            // Clear the input field after sending the message.
            setInput("")
          }}
          className="border-t border-sky-200 p-4"
        >
          {/* Display an error message if the API call fails. */}
          {error && (
            <p className="mb-2 text-center text-xs text-red-500">
              An error occurred: {error.message}. Please try again.
            </p>
          )}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about land degradation, analysis results, or restoration strategies..."
              className="flex-1 border-sky-300 focus-visible:ring-sky-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input || !input.trim()}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
