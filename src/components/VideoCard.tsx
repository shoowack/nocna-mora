"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, PlayCircle } from "lucide-react";
import { getThumbnailUrl } from "@/lib/video-providers";
import { formatDuration, formatDate } from "@/lib/utils";

type Props = {
  video: {
    slug: string;
    title: string;
    provider: "youtube" | "vimeo" | "dailymotion" | "facebook";
    videoId: string;
    videoType: "full" | "clip";
    duration?: number | null;
    airedDate?: string | null;
    thumbnail?: { url: string } | null;
  };
};

export function VideoCard({ video }: Props) {
  const thumbnailUrl =
    video.thumbnail?.url || getThumbnailUrl(video.provider, video.videoId);
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/video/${video.slug}`}
      className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
      data-umami-event="video click"
      data-umami-event-title={video.title}
      data-umami-event-type={video.videoType}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-12 w-12 text-white" />
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
            <Clock className="h-3 w-3" />
            {formatDuration(video.duration)}
          </span>
        )}
        {video.videoType === "clip" && (
          <span className="absolute left-2 top-2 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-white">
            Isječak
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        {video.airedDate && (
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(video.airedDate)}
          </p>
        )}
      </div>
    </Link>
  );
}
