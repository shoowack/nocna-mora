import { auth } from "@/auth"
import { NextRequest } from "next/server"

// Review if we need this, and why
function stripContentEncoding(result: Response) {
  const responseHeaders = new Headers(result.headers)
  responseHeaders.delete("content-encoding")

  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers: responseHeaders,
  })
}

async function handler(request: NextRequest) {
  const session = await auth()

  if (!session?.accessToken) {
    return new Response("Not authenticated", { status: 401 })
  }

  const backendUrl = process.env.THIRD_PARTY_API_EXAMPLE_BACKEND

  if (!backendUrl) {
    return new Response("Proxy backend is not configured", { status: 500 })
  }

  const backendOrigin = (() => {
    try {
      const parsed = new URL(backendUrl)

      if (parsed.protocol !== "https:") {
        return null
      }

      return parsed.origin
    } catch {
      return null
    }
  })()

  if (!backendOrigin) {
    return new Response("Proxy backend URL must be a valid https URL", {
      status: 500,
    })
  }

  const targetUrl = request.nextUrl.href.replace(request.nextUrl.origin, backendOrigin)

  if (!targetUrl.startsWith(backendOrigin)) {
    return new Response("Invalid proxy target", { status: 400 })
  }

  const headers = new Headers()
  headers.set("Authorization", `Bearer ${session.accessToken}`)

  const contentType = request.headers.get("content-type")
  if (contentType) {
    headers.set("content-type", contentType)
  }

  const result = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "POST" ? request.body : undefined,
    cache: "no-store",
  })

  return stripContentEncoding(result)
}

export const dynamic = "force-dynamic"

export { handler as GET, handler as POST }
