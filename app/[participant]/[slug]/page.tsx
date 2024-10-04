import prisma from "@/lib/prisma";
import Link from "next/link";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { ParticipantType } from "@prisma/client";
import { Container } from "@/components/container";
import { auth } from "auth";
import { calculateAge } from "@/lib/date";
import { Button } from "@/components/ui/button";

export default async function ParticipantPage({
  params: { slug, participant: participantTypeProp },
}: {
  params: { participant: string; slug: string };
}) {
  const session = await auth();

  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role,
    };
  }

  const isAdmin = session?.user?.role === "admin";

  const participant = await prisma.participant.findUnique({
    where: {
      slug,
      type:
        participantTypeProp === "actor"
          ? ParticipantType.MAIN
          : ParticipantType.GUEST,
    },
    include: {
      createdBy: true,
      videos: {
        where: isAdmin
          ? {} // No filter for admins
          : { published: true }, // Non-admins see only published videos,
        include: {
          categories: true,
        },
      },
    },
  });

  if (!participant) {
    return <Container>Lik {slug} ne postoji</Container>;
  }

  return (
    <TitleTemplate
      title={`${participant.firstName} ${participant.lastName} ${
        participant.nickname ? ` - ${participant.nickname}` : ""
      } ${
        participant.birthDate
          ? ` (${calculateAge(participant.birthDate, participant.deathDate)})`
          : ""
      }`}
      description={participant.bio ? participant.bio : ""}
      contained
      button={
        <Link href={`/${participantTypeProp}/${participant.slug}/edit`}>
          <Button>
            Ažuriraj {`${participantTypeProp === "actor" ? "lika" : "gosta"}`}
          </Button>
        </Link>
      }
    >
      {participant.videos.length > 0 ? (
        <>
          <p className="mt-10 text-xl font-bold">
            Videi u kojima se{" "}
            {participant.nickname
              ? participant.nickname
              : `${participant.firstName} ${participant.lastName}`}{" "}
            pojavljuje:
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            {participant.videos.map((video) => (
              <VideoDetail key={video.id} video={video} showCategories />
            ))}
          </div>
        </>
      ) : (
        <div>Nema videa sa likom</div>
      )}
    </TitleTemplate>
  );
}
