export interface VideoFilterParams {
  type?: string[]
  categories?: string[]
  participants?: string[]
  date?: string
  published?: string
  page?: number
  perPage?: number
}

export const PAGE_SIZE_OPTIONS = [12, 24, 48] as const
export const DEFAULT_PAGE_SIZE = 12

export function buildVideoUrl(params: VideoFilterParams): string {
  const qs = new URLSearchParams()

  if (params.type && params.type.length > 0) {
    qs.set('type', params.type.join(','))
  }
  if (params.categories && params.categories.length > 0) {
    qs.set('categories', params.categories.join(','))
  }
  if (params.participants && params.participants.length > 0) {
    qs.set('participants', params.participants.join(','))
  }
  if (params.date) {
    qs.set('date', params.date)
  }
  if (params.published !== undefined && params.published !== '') {
    qs.set('published', params.published)
  }
  if (params.page && params.page > 1) {
    qs.set('page', String(params.page))
  }
  if (params.perPage && params.perPage !== DEFAULT_PAGE_SIZE) {
    qs.set('perPage', String(params.perPage))
  }

  const query = qs.toString()
  return query ? `/video?${query}` : '/video'
}

export function parseVideoParams(raw: {
  page?: string
  type?: string
  categories?: string
  participants?: string
  date?: string
  published?: string
  perPage?: string
}) {
  const perPage = parseInt(raw.perPage || String(DEFAULT_PAGE_SIZE))
  return {
    page: parseInt(raw.page || '1'),
    type: raw.type ? raw.type.split(',').filter(Boolean) : [],
    categories: raw.categories ? raw.categories.split(',').filter(Boolean) : [],
    participants: raw.participants ? raw.participants.split(',').filter(Boolean) : [],
    date: raw.date || '',
    published: raw.published || '',
    perPage: PAGE_SIZE_OPTIONS.includes(perPage as any) ? perPage : DEFAULT_PAGE_SIZE,
  }
}
