import prisma from "@/lib/prisma";
import Link from "next/link";
import { Container } from "@/components/container";
import { VideoDetail } from "@/components/video-detail";
import { Video, ParticipantType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";

export const VideosWithParticipant = async () => {
  // Step 1: Filter participants who have at least 4 videos
  const eligibleParticipants = await prisma.participant.findMany({
    where: {
      videos: {
        some: {}, // Participant must have some videos
      },
    },
    include: {
      videos: true,
    },
  });

  // Filter only participants with 4 or more videos
  const filteredParticipants = eligibleParticipants.filter(
    (participant) => participant.videos.length >= 4
  );

  // If no eligible participant found, return null
  if (filteredParticipants.length === 0) {
    return null;
  }

  // Step 2: Pick a random participant from the filtered list
  const randomIndex = Math.floor(Math.random() * filteredParticipants.length);
  const firstParticipant = filteredParticipants[randomIndex];

  // Get the latest 4 videos for the selected participant
  const videos = await prisma.video.findMany({
    where: {
      participants: {
        some: {
          id: firstParticipant.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  const participantType =
    firstParticipant.type === ParticipantType.MAIN ? "actor" : "guest";
  const participantLink = `/${participantType}/${firstParticipant.slug}`;

  return (
    <Container>
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-2.5">
          <User className="size-6 stroke-red-600" strokeWidth={2} />
          <p className="text-lg font-bold sm:text-xl">
            Video kolekcija: {firstParticipant.firstName}{" "}
            {firstParticipant.lastName}{" "}
            {firstParticipant.nickname && `(${firstParticipant.nickname})`}{" "}
          </p>
        </div>
        <Button>
          <Link href={participantLink}>Prikaži sve</Link>
        </Button>
      </div>
      <Separator className="mb-10 mt-2" />

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {videos.map((video: Video) => (
          <Card key={video.id} className="overflow-hidden bg-stone-100">
            <VideoDetail video={video} showActors showCategories />
          </Card>
        ))}
      </div>
    </Container>
  );
};
