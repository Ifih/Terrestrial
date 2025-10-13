import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="w-full max-w-sm">
        <Card className="border-emerald-200">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-900">Check Your Email</CardTitle>
            <CardDescription className="text-emerald-700">We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-emerald-700">
              Please check your email and click the confirmation link to activate your account before signing in.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
