import { getPayload } from "@/lib/payload"
import { LoginForm } from "./LoginForm"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function LoginPage() {
  const payload = await getPayload()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (user) redirect("/")

  return <LoginForm />
}
