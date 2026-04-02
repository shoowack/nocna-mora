import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { LoginForm } from './LoginForm'

export default async function LoginPage() {
  const payload = await getPayload()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (user) redirect('/')

  return <LoginForm />
}
