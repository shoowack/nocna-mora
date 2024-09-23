"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Videotape } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export const VideoGallery = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data.videos));
  }, []);

  return videos ? (
    <>
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-2.5 items-center">
          <Videotape className="stroke-red-600 size-6" strokeWidth={2} />
          <p className="text-xl font-bold">Najnovije epizode</p>
        </div>
        <Button size={"sm"} disabled>
          Prikaži sve
        </Button>
      </div>
      <Separator className="mt-2 mb-10" />

      <div className="grid grid-cols-3 gap-5">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-neutral-200 rounded-lg overflow-hidden"
          >
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <div className="p-4 space-y-4">
              <p className="text-neutral-600 line-clamp-1">{video.title}</p>

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
              ) : (
                <div className="h-5" />
              )}

              {video.actors.length > 0 && (
                <div className="flex gap-x-1 flex-wrap">
                  {video.actors.map((actor) => (
                    <Link key={actor.id} href={`/actors/${actor.slug}`}>
                      <Badge
                        className="m-0 px-1.5"
                        key={actor.id}
                      >{`${actor.firstName} ${actor.lastName}`}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div className="text-center">No videos found</div>
  );
};
