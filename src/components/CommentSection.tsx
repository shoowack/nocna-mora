'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'

type Comment = {
  id: string
  content: string
  createdAt: string
  author: { name: string }
}

type Props = {
  videoId: string
  initialComments: Comment[]
}

export function CommentSection({ videoId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), video: videoId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.errors?.[0]?.message || 'Greška pri slanju komentara')
      }

      setContent('')
      // Comment needs approval, show message
      setError(null)
      ;(window as any).umami?.track('comment submitted')
      alert('Komentar je poslan na odobrenje.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nešto je pošlo po krivu')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Komentari ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Napiši komentar..."
          maxLength={500}
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{content.length}/500</span>
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Šaljem...' : 'Komentiraj'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Još nema komentara. Budi prvi!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
