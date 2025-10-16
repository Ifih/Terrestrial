/**
 * Creates a Supabase client that is compatible with the Vercel Edge Runtime.
 * This is necessary for API routes that are configured with `export const runtime = "edge"`.
 * It uses `cookies` from `next/headers` to manage authentication state.
 */
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

// Create an async factory that captures the cookie store once in an async
// context. This avoids calling `cookies()` synchronously which Next warns
// against in edge runtimes.
export async function createClient() {
  // `cookies()` may be a Promise-returning API in some Next versions/types,
  // so await it to get the concrete cookie store instance.
  // `cookies()` can have slightly different shapes across Next versions
  // (sometimes a Promise-wrapped object). Cast to `any` and guard usage
  // to avoid TypeScript signature mismatches while still calling the
  // runtime methods where available.
  const cookieStore: any = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (!cookieStore) return undefined
          return typeof cookieStore.get === "function"
            ? cookieStore.get(name)?.value
            : undefined
        },
        set(name: string, value: string, options: CookieOptions) {
          if (!cookieStore) return
          if (typeof cookieStore.set === "function") {
            // Some implementations accept options, others don't. Pass them
            // when available.
            try {
              cookieStore.set(name, value, options)
            } catch (_err) {
              // Fallback to calling without options
              cookieStore.set(name, value)
            }
          }
        },
        remove(name: string, options: CookieOptions) {
          if (!cookieStore) return
          if (typeof cookieStore.delete === "function") {
            cookieStore.delete(name)
          } else if (typeof cookieStore.remove === "function") {
            cookieStore.remove(name)
          }
        },
      },
    },
  )
}