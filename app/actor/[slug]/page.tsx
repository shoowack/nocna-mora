import prisma from "@/lib/prisma";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { ActorType } from "@prisma/client";
import { Container } from "@/components/container";
import { auth } from "auth";

export default async function ActorPage({ params }) {
  const { slug } = params;
  const session = await auth();

  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  const actor = await prisma.actor.findUnique({
    where: { slug, type: ActorType.MAIN },
    include: {
      createdBy: true,
      videos: {
        include: {
          categories: true,
        },
      },
    },
  });

  if (!actor) {
    return <Container>Lik {slug} ne postoji</Container>;
  }

  // Filter videos: Show all videos if user is logged in, otherwise show only published videos
  const visibleVideos = session?.user
    ? actor?.videos // Logged in users see all videos
    : actor?.videos.filter((video) => video.published); // Non-logged in users see only published videos

  return (
    <TitleTemplate
      title={`${actor.firstName} ${actor.lastName} ${
        actor.nickname ? ` - ${actor.nickname}` : ""
      } ${actor.age ? ` (${actor.age})` : ""}`}
      description={actor.bio ? actor.bio : ""}
      contained
    >
      {visibleVideos.length > 0 ? (
        <>
          <p className="text-xl font-bold mt-10">
            Videi u kojima se{" "}
            {actor.nickname
              ? actor.nickname
              : `${actor.firstName} ${actor.lastName}`}{" "}
            pojavljuje:
          </p>
          <div className="grid grid-cols-2 mt-3 gap-4">
            {visibleVideos.map((video) => (
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
