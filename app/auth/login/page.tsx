"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="w-full max-w-sm">
        <Card className="border-emerald-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-emerald-900">Land Degradation Monitor</CardTitle>
            <CardDescription className="text-emerald-700">Sign in to access AI-powered land analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-emerald-900">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="researcher@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-emerald-300 focus:border-emerald-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-emerald-900">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-emerald-300 focus:border-emerald-500"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-emerald-700">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="font-medium text-emerald-600 underline underline-offset-4 hover:text-emerald-800"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
