"use client";

import { FC } from "react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Provider, Video } from "@/types/video";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

interface VideoDetailProps {
  video: Video;
  singleVideo?: boolean;
  showCategories?: boolean;
  showActors?: boolean;
}

export const VideoDetail: FC<VideoDetailProps> = ({
  video,
  singleVideo,
  showCategories,
  showActors,
}) => {
  const getVideoUrl = () => {
    switch (video.provider) {
      case "YOUTUBE":
        return `https://www.youtube.com/embed/${video.videoId}`;
      case "VIMEO":
        return `https://player.vimeo.com/video/${video.videoId}`;
      case "DAILYMOTION":
        return `https://geo.dailymotion.com/player.html?video=${video.videoId}`;
      default:
        return "";
    }
  };

  const getThumbnailUrl = () => {
    switch (video.provider) {
      case "YOUTUBE":
        return `https://img.youtube.com/vi/${video.videoId}/0.jpg`;
      case "VIMEO":
        return `https://vumbnail.com/${video.videoId}_1920x1080.jpg`;
      case "DAILYMOTION":
        return `https://www.dailymotion.com/thumbnail/video/${video.videoId}`;
      default:
        return "";
    }
  };

  const videoUrl = getVideoUrl();
  const thumbnailUrl = getThumbnailUrl();

  return (
    <div>
      {singleVideo && (
        <h1 className={cn("text-2xl font-bold", { "mb-4": singleVideo })}>
          {video.title}
        </h1>
      )}
      {singleVideo && videoUrl ? (
        <iframe
          className="aspect-video w-full bg-black"
          src={videoUrl}
          title={video.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <Link href={`/video/${video.id}`}>
          <div className="relative aspect-video w-full bg-black">
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt={video.title}
                fill
                className="w-full"
              />
            )}
            <PlayCircle
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 stroke-white size-14"
              strokeWidth={1}
            />
          </div>
        </Link>
      )}

      <div className="p-4 space-y-4">
        {!singleVideo && (
          <p className="text-neutral-600 line-clamp-1">{video.title}</p>
        )}
        {video.airedDate && singleVideo && <h2>Aired Date:</h2>}
        {video.airedDate ? (
          <Badge variant="secondary" className="whitespace-nowrap">
            {new Date(video.airedDate).toLocaleString("hr-HR", {
              timeZone: "UTC",
              //   weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Badge>
        ) : singleVideo ? null : (
          <div className="h-5" />
        )}

        {video.actors?.length > 0 && showActors && (
          <>
            {singleVideo && <h2>Actors:</h2>}
            <div className="flex gap-x-1 flex-wrap">
              {video.actors.map((actor) => (
                <Link key={actor.id} href={`/actor/${actor.slug}`}>
                  <Badge className="m-0 px-1.5">{`${actor.firstName} ${actor.lastName}`}</Badge>
                </Link>
              ))}
            </div>
          </>
        )}
        {showCategories && showActors && (
          <Separator className="w-full bg-neutral-300" />
        )}
        {video.categories?.length > 0 && showCategories && (
          <>
            {singleVideo && <h2>Categories:</h2>}
            <div className="flex gap-x-1 flex-wrap">
              {video.categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Badge className="m-0 px-1.5">{category.title}</Badge>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* <p>Duration: {video.duration} seconds</p>
      {video.airedDate && (
        <p>Aired Date: {new Date(video.airedDate).toLocaleDateString()}</p>
      )}
      <p>Provider: {video.provider}</p>
      <div>
        <h2>Categories:</h2>
        <ul>
          {video.categories.map((category: any) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Actors:</h2>
        <ul>
          {video.actors.map((actor: any) => (
            <li key={actor.id}>
              {actor.firstName} {actor.lastName}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};
