import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login"]

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value)
          )
        },
      },
    }
  )

  // Refreshes the session cookie. This is an optimistic gate only;
  // server actions and loaders re-verify the user themselves.
  const { data } = await supabase.auth.getClaims()
  const signedIn = Boolean(data?.claims)
  const isPublic = PUBLIC_PATHS.includes(request.nextUrl.pathname)

  if (!signedIn && !isPublic) return redirectTo("/login", request, response)
  if (signedIn && isPublic) return redirectTo("/", request, response)

  return response
}

// Carries refreshed session cookies and cache headers over to the redirect.
function redirectTo(path: string, request: NextRequest, from: NextResponse) {
  const redirect = NextResponse.redirect(new URL(path, request.url))
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  from.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") redirect.headers.set(key, value)
  })
  return redirect
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png)$).*)"],
}
