import { getPayload } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get('videoId')
  if (!videoId) return NextResponse.json({ reaction: null })

  const payload = await getPayload()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) return NextResponse.json({ reaction: null })

  const result = await payload.find({
    collection: 'reactions',
    where: {
      and: [{ video: { equals: videoId } }, { user: { equals: user.id } }],
    },
    limit: 1,
  })

  if (result.docs.length === 0) return NextResponse.json({ reaction: null })

  return NextResponse.json({ reaction: { id: result.docs[0].id, type: result.docs[0].type } })
}

export async function POST(req: NextRequest) {
  const payload = await getPayload()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, videoId } = await req.json()

  const existing = await payload.find({
    collection: 'reactions',
    where: {
      and: [{ video: { equals: videoId } }, { user: { equals: user.id } }],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const updated = await payload.update({
      collection: 'reactions',
      id: existing.docs[0].id,
      data: { type },
    })
    return NextResponse.json({ reaction: { id: updated.id, type: updated.type } })
  }

  const created = await payload.create({
    collection: 'reactions',
    data: { type, video: videoId, user: user.id },
  })
  return NextResponse.json({ reaction: { id: created.id, type: created.type } })
}

export async function DELETE(req: NextRequest) {
  const payload = await getPayload()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { videoId } = await req.json()

  const existing = await payload.find({
    collection: 'reactions',
    where: {
      and: [{ video: { equals: videoId } }, { user: { equals: user.id } }],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    await payload.delete({
      collection: 'reactions',
      id: existing.docs[0].id,
    })
  }

  return NextResponse.json({ success: true })
}
