import prisma from "@/lib/prisma";
import Link from "next/link";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { ActorType } from "@prisma/client";
import { Container } from "@/components/container";
import { auth } from "auth";
import { calculateAge } from "@/lib/date";
import { Button } from "@/components/ui/button";

export default async function ParticipantPage({
  params: { slug, participant },
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

  const actor = await prisma.actor.findUnique({
    where: {
      slug,
      type: participant === "actor" ? ActorType.MAIN : ActorType.GUEST,
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

  if (!actor) {
    return <Container>Lik {slug} ne postoji</Container>;
  }

  return (
    <TitleTemplate
      title={`${actor.firstName} ${actor.lastName} ${
        actor.nickname ? ` - ${actor.nickname}` : ""
      } ${
        actor.birthDate
          ? ` (${calculateAge(actor.birthDate, actor.deathDate)})`
          : ""
      }`}
      description={actor.bio ? actor.bio : ""}
      contained
      button={
        <Link href={`/${participant}/${actor.slug}/edit`}>
          <Button>
            Ažuriraj {`${participant === "actor" ? "lika" : "gosta"}`}
          </Button>
        </Link>
      }
    >
      {actor.videos.length > 0 ? (
        <>
          <p className="mt-10 text-xl font-bold">
            Videi u kojima se{" "}
            {actor.nickname
              ? actor.nickname
              : `${actor.firstName} ${actor.lastName}`}{" "}
            pojavljuje:
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            {actor.videos.map((video) => (
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
