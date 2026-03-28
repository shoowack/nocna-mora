'use client'

import { useState } from 'react'

const REACTION_EMOJIS: Record<string, string> = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡',
}

type ReactionCount = {
  type: string
  count: number
}

type Props = {
  videoId: string
  initialReactions: ReactionCount[]
  userReaction?: string | null
}

export function Reactions({ videoId, initialReactions, userReaction }: Props) {
  const [reactions, setReactions] = useState<ReactionCount[]>(initialReactions)
  const [activeReaction, setActiveReaction] = useState<string | null>(userReaction || null)

  async function handleReaction(type: string) {
    try {
      if (activeReaction === type) {
        // Remove reaction
        await fetch(`/api/reactions`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ video: videoId }),
        })
        setActiveReaction(null)
        setReactions((prev) =>
          prev.map((r) => (r.type === type ? { ...r, count: Math.max(0, r.count - 1) } : r))
        )
      } else {
        // Add/change reaction
        await fetch('/api/reactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, video: videoId }),
        })

        setReactions((prev) => {
          const updated = prev.map((r) => {
            if (r.type === type) return { ...r, count: r.count + 1 }
            if (r.type === activeReaction) return { ...r, count: Math.max(0, r.count - 1) }
            return r
          })
          // Add reaction type if not in list
          if (!updated.find((r) => r.type === type)) {
            updated.push({ type, count: 1 })
          }
          return updated
        })
        setActiveReaction(type)
      }
    } catch {
      // Silently fail, user might not be logged in
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => {
        const count = reactions.find((r) => r.type === type)?.count || 0
        const isActive = activeReaction === type

        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50'
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
