"use client"

import { getEmbedUrl } from "@/lib/video-providers"

type Props = {
  provider: "youtube" | "vimeo" | "dailymotion" | "facebook"
  videoId: string
  title: string
}

export function VideoEmbed({ provider, videoId, title }: Props) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        src={getEmbedUrl(provider, videoId)}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        {...(provider === "facebook" && { scrolling: "no" as any, allowTransparency: true })}
      />
    </div>
  )
}
