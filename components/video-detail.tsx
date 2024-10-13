import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlayCircle } from "lucide-react";
import {
  ParticipantType,
  VideoProvider,
  Video,
  Category,
  Participant,
} from "@prisma/client";
import { Container } from "@/components/container";

const VideoContent: FC<{
  video: Video & { participants?: Participant[]; categories?: Category[] };
  singleVideo?: boolean;
  showActors?: boolean;
  showCategories?: boolean;
}> = ({ singleVideo, video, showActors, showCategories }) => {
  return (
    <div className="space-y-4 p-4">
      {!video.published && (
        <Badge variant="destructive">Video nije javan</Badge>
      )}
      {!singleVideo && (
        <p className="line-clamp-1 text-stone-600" title={video.title}>
          {video.title}
        </p>
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
      {video.participants && video.participants?.length > 0 && showActors && (
        <>
          {singleVideo && <h2>Sudionici:</h2>}
          <div className="flex flex-wrap gap-x-1">
            {video.participants.map(
              ({ id, type, slug, firstName, lastName }) => (
                <Link
                  key={id}
                  href={`/${
                    type === ParticipantType.GUEST ? "guest" : "actor"
                  }/${slug}`}
                >
                  <Badge className="m-0 px-1.5">{`${firstName} ${lastName}`}</Badge>
                </Link>
              )
            )}
          </div>
        </>
      )}
      {video.categories &&
        video.categories.length > 0 &&
        showCategories &&
        video.participants &&
        video.participants.length > 0 &&
        showActors && <Separator className="w-full bg-stone-300" />}
      {video.categories && video.categories.length > 0 && showCategories && (
        <>
          {singleVideo && <h2>Categories:</h2>}
          <div className="flex flex-wrap gap-x-1">
            {video.categories?.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Badge className="m-0 px-1.5">{category.title}</Badge>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
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
      case VideoProvider.YOUTUBE:
        return `https://www.youtube.com/embed/${video.videoId}`;
      case VideoProvider.VIMEO:
        return `https://player.vimeo.com/video/${video.videoId}`;
      case VideoProvider.DAILYMOTION:
        return `https://geo.dailymotion.com/player.html?video=${video.videoId}`;
      default:
        return "";
    }
  };

  const getThumbnailUrl = () => {
    switch (video.provider) {
      case VideoProvider.YOUTUBE:
        return `https://img.youtube.com/vi/${video.videoId}/0.jpg`;
      case VideoProvider.VIMEO:
        return `https://vumbnail.com/${video.videoId}_1920x1080.jpg`;
      case VideoProvider.DAILYMOTION:
        return `https://www.dailymotion.com/thumbnail/video/${video.videoId}`;
      default:
        return "";
    }
  };

  const videoUrl = getVideoUrl();
  const thumbnailUrl = getThumbnailUrl();

  return (
    <div>
      {singleVideo && videoUrl ? (
        <div className="w-full bg-black">
          <Container className="py-0 md:py-0">
            <iframe
              className="aspect-video w-full"
              src={videoUrl}
              title={video.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </Container>
        </div>
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
              className="absolute left-1/2 top-1/2 z-20 size-14 -translate-x-1/2 -translate-y-1/2 stroke-white"
              strokeWidth={1}
            />
            {video.provider === "YOUTUBE" ? (
              <svg
                className="absolute bottom-2 right-2 z-10 size-6"
                width="64px"
                height="44.86px"
                viewBox="0 0 64 44.86"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g fillRule="nonzero">
                    <path
                      d="M62.603,7.026 C61.8538125,4.26388323 59.6961168,2.10618754 56.934,1.357 C51.964,0 31.96,0 31.96,0 C31.96,0 11.955,0.04 6.984,1.397 C4.22188323,2.14618754 2.06418754,4.30388323 1.315,7.066 C0,12.037 0,22.43 0,22.43 C0,22.43 0,32.823 1.356,37.834 C2.10518754,40.5961168 4.26288323,42.7538125 7.025,43.503 C11.995,44.86 32,44.86 32,44.86 C32,44.86 52.005,44.86 56.976,43.504 C59.7381168,42.7548125 61.8958125,40.5971168 62.645,37.835 C64,32.864 64,22.43 64,22.43 C64,22.43 63.96,12.037 62.603,7.026 Z"
                      id="Path"
                      fill="#FF0000"
                    />
                    <polygon
                      fill="#FFFFFF"
                      points="25.592 32.042 42.187 22.43 25.591 12.818"
                    />
                  </g>
                </g>
              </svg>
            ) : video.provider === "VIMEO" ? (
              <svg
                className="absolute bottom-2 right-2 z-10 size-6"
                width="64.008692px"
                height="55.1577009px"
                viewBox="0 0 64.008692 55.1577009"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    transform="translate(0, 0)"
                    fill="#1CA7CC"
                    fillRule="nonzero"
                  >
                    <path d="M63.9769231,12.6961624 C63.6923077,18.911547 59.3384615,27.4269317 50.9230769,38.234624 C42.2153846,49.5192394 34.8461538,55.1577009 28.8230769,55.1577009 C25.0923077,55.1577009 21.9307692,51.711547 19.3615385,44.8269317 L14.2076923,25.8884701 C12.2846154,18.9961624 10.2307692,15.5577009 8.03846154,15.5577009 C7.56153846,15.5577009 5.88461538,16.5577009 3.01538462,18.5730855 L-8.54351312e-16,14.6961624 L9.3,6.37308551 C13.5076923,2.73462397 16.6615385,0.834623971 18.7615385,0.634623971 C23.7615385,0.165393202 26.8153846,3.55770089 27.9615385,10.911547 L30.5461538,25.5500086 C31.9769231,32.0577009 33.5615385,35.3192394 35.2769231,35.3192394 C36.6153846,35.3192394 38.6230769,33.211547 41.3076923,29.011547 C43.9923077,24.811547 45.4230769,21.5961624 45.6153846,19.3961624 C46,15.7577009 44.5615385,13.934624 41.3076923,13.934624 C39.7692308,13.934624 38.2,14.2730855 36.5769231,14.934624 C39.6538462,4.70385474 45.7615385,-0.273068336 54.6538462,0.0115470483 C61.2538462,0.203854741 64.3615385,4.45770089 63.9769231,12.7807778 L63.9769231,12.6961624 Z" />
                  </g>
                </g>
              </svg>
            ) : video.provider === "DAILYMOTION" ? (
              <svg
                className="absolute bottom-2 right-2 z-10 size-6"
                width="39.755px"
                height="51.301px"
                viewBox="0 0 39.755 51.301"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    transform="translate(-105.112, -6.344)"
                    fill="#FFFFFF"
                    fillRule="nonzero"
                  >
                    <path d="M144.867,6.344 L144.867,57.281 L134.082,57.281 L134.082,53.381 C131.24,56.141 127.415,57.645 122.942,57.645 C113.16,57.645 105.112,49.305 105.112,38.845 C105.112,28.385 113.724,19.929 122.942,19.929 C127.415,19.929 131.24,21.517 134.082,24.329 L134.082,8.506 L144.867,6.344 Z M125.387,47.75 C130.406545,47.7455891 134.474589,43.6775448 134.479,38.658 C134.47514,33.6380647 130.406935,29.5694116 125.387,29.565 C120.367065,29.5694116 116.29886,33.6380647 116.295,38.658 C116.299411,43.6775448 120.367455,47.7455891 125.387,47.75 L125.387,47.75 Z" />
                  </g>
                </g>
              </svg>
            ) : null}
          </div>
        </Link>
      )}

      {singleVideo ? (
        <Container>
          <VideoContent
            showCategories={showCategories}
            showActors={showActors}
            video={video}
          />
        </Container>
      ) : (
        <VideoContent
          showCategories={showCategories}
          showActors={showActors}
          video={video}
        />
      )}
    </div>
  );
};
