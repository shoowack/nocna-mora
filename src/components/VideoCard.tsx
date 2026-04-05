'use client'

import { useState } from 'react'
import { BookDashed, Clapperboard, Clock, Play, PlayCircle, Tv } from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDate, formatDuration } from '@/lib/utils'
import { getThumbnailUrl } from '@/lib/video-providers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  video: {
    slug: string
    title: string
    provider: 'youtube' | 'vimeo' | 'dailymotion' | 'facebook'
    videoId: string
    videoType: 'full' | 'clip'
    published?: boolean
    duration?: number | null
    airedDate?: string | null
    thumbnail?: { url: string } | null
  }
}

export function VideoCard({ video }: Props) {
  const [imgError, setImgError] = useState(false)

  const thumbnailUrl = video.thumbnail?.url || getThumbnailUrl(video.provider, video.videoId)
  const Icon = video.videoType === 'clip' ? Clapperboard : Tv

  return (
    <Link
      href={`/video/${video.slug}`}
      data-umami-event="video click"
      data-umami-event-title={video.title}
      data-umami-event-type={video.videoType}
    >
      <Card className="w-full max-w-sm h-full pb-0 relative min-h-72 group">
        <CardHeader className="z-10">
          <CardTitle>{video.title}</CardTitle>
          <CardDescription>
            {video.airedDate && (
              <p className="text-xs text-muted-foreground">{formatDate(video.airedDate)}</p>
            )}
          </CardDescription>
          <CardAction className="flex flex-col gap-y-2">
            {video.duration && (
              <Badge variant="default-soft">
                <Clock className="h-3 w-3" />
                {formatDuration(video.duration)}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="h-full z-10" />

        <CardFooter className="z-10 flex items-center gap-2 justify-between bg-transparent border-0">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" className="!bg-muted" size="sm">
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{video.videoType === 'clip' ? 'Isječak' : 'Cijela emisija'}</p>
            </TooltipContent>
          </Tooltip>
          {video.published === false && (
            <Tooltip>
              <TooltipTrigger>
                <Button variant="default" size="sm">
                  <BookDashed />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Neobjavljeno</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardFooter>
        <div className="absolute min-w-full mask-linear-[180deg,transparent,white_40%,white] inset-x-0 bottom-0 aspect-video overflow-hidden bg-muted min-h-5/6 z-0 left-1/2 -translate-x-1/2">
          <div className="gradient-blur-top absolute inset-x-0 -top-12.5 h-37.5 group-hover:h-0 transition-all w-full z-10 pointer-events-none">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
          {thumbnailUrl && !imgError ? (
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20">
              <PlayCircle className="h-10 w-10 shrink-0 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 z-10">
            <Play className="h-12 w-12 text-white" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
