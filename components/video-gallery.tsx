"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Videotape } from "lucide-react";
import { Button } from "./ui/button";
import { Container } from "@/components/container";
import { Video, Provider } from "@/types/video";

import Link from "next/link";

export const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  console.log("videos:", videos);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data.videos));
  }, []);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="bg-neutral-100">
      <Container>
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

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 xl:grid-cols-4">
          {videos.map((video: Video) => (
            <div
              key={video.id}
              className="bg-neutral-200 rounded-lg overflow-hidden"
            >
              <iframe
                className="aspect-video w-full bg-black"
                src={`https://${
                  video.provider === "YOUTUBE"
                    ? `www.youtube.com/embed/`
                    : video.provider === "DAILYMOTION"
                    ? `geo.dailymotion.com/player.html?video=`
                    : `player.vimeo.com/video/`
                }${video.videoId}`}
                title={video.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
                      <Link key={actor.id} href={`/actor/${actor.slug}`}>
                        <Badge className="m-0 px-1.5">{`${actor.firstName} ${actor.lastName}`}</Badge>
                      </Link>
                    ))}
                  </div>
                )}
                <Separator className="w-full bg-neutral-300" />
                {video.categories.length > 0 && (
                  <div className="flex gap-x-1 flex-wrap">
                    {video.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                      >
                        <Badge className="m-0 px-1.5">{category.title}</Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
