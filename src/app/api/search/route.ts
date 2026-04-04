import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'
import { sql } from 'drizzle-orm'

/**
 * Custom search endpoint that uses PostgreSQL full-text search.
 * Falls back to Payload's built-in search if FTS is not yet configured.
 *
 * Usage: GET /api/search?q=search+term&category=id&participant=id&from=2000-01-01&to=2005-12-31&page=1
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category')
  const participant = searchParams.get('participant')
  const dateFrom = searchParams.get('from')
  const dateTo = searchParams.get('to')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12

  if (!query.trim()) {
    return NextResponse.json({ docs: [], totalDocs: 0, page, totalPages: 0 })
  }

  const payload = await getPayload()
  const { user } = await payload.auth({ headers: request.headers })
  const isAdmin = user?.role === 'admin'

  try {
    // Try PostgreSQL FTS via Drizzle (available after running migrations/0001_fts_setup.sql)
    const db = payload.db

    // Sanitize and format the query for tsquery
    const tsQuery = query
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => `${word}:*`)
      .join(' & ')

    const offset = (page - 1) * limit

    // Use raw SQL for FTS
    const result = await (db as any).execute(sql`
      SELECT v.id, v.title, v.slug, v.description, v.provider, v."video_id" as "videoId",
             v."video_type" as "videoType", v."aired_date" as "airedDate", v.duration,
             ts_rank(v.search_vector, to_tsquery('croatian', ${tsQuery})) AS rank
      FROM videos v
      WHERE ${isAdmin ? sql`true` : sql`v.published = true`}
        AND v.search_vector @@ to_tsquery('croatian', ${tsQuery})
        ${category ? sql`AND v.id IN (SELECT video_id FROM videos_rels WHERE path = 'categories' AND "categories_id" = ${category})` : sql``}
        ${participant ? sql`AND v.id IN (SELECT video_id FROM videos_rels WHERE path = 'participants' AND "participants_id" = ${participant})` : sql``}
        ${dateFrom ? sql`AND v."aired_date" >= ${dateFrom}::date` : sql``}
        ${dateTo ? sql`AND v."aired_date" <= ${dateTo}::date` : sql``}
      ORDER BY rank DESC, v."aired_date" DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    const countResult = await (db as any).execute(sql`
      SELECT COUNT(*) as total FROM videos v
      WHERE ${isAdmin ? sql`true` : sql`v.published = true`}
        AND v.search_vector @@ to_tsquery('croatian', ${tsQuery})
        ${category ? sql`AND v.id IN (SELECT video_id FROM videos_rels WHERE path = 'categories' AND "categories_id" = ${category})` : sql``}
        ${participant ? sql`AND v.id IN (SELECT video_id FROM videos_rels WHERE path = 'participants' AND "participants_id" = ${participant})` : sql``}
        ${dateFrom ? sql`AND v."aired_date" >= ${dateFrom}::date` : sql``}
        ${dateTo ? sql`AND v."aired_date" <= ${dateTo}::date` : sql``}
    `)

    const totalDocs = parseInt(countResult.rows?.[0]?.total || '0')

    return NextResponse.json({
      docs: result.rows || [],
      totalDocs,
      page,
      totalPages: Math.ceil(totalDocs / limit),
    })
  } catch {
    // Fallback to Payload's built-in search if FTS is not configured
    const results = await payload.find({
      collection: 'videos',
      where: {
        and: [
          ...(isAdmin ? [] : [{ published: { equals: true } }]),
          {
            or: [
              { title: { contains: query } },
              { description: { contains: query } },
              { transcriptionPlain: { contains: query } },
            ],
          },
        ],
      },
      sort: '-airedDate',
      page,
      limit,
    })

    return NextResponse.json({
      docs: results.docs,
      totalDocs: results.totalDocs,
      page: results.page,
      totalPages: results.totalPages,
    })
  }
}
