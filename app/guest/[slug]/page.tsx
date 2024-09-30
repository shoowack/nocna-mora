import prisma from "@/lib/prisma";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { ActorType, Role } from "@prisma/client";
import { Container } from "@/components/container";
import { auth } from "auth";

export default async function GuestPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
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
    where: { slug, type: ActorType.GUEST },
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
    return <Container>Gost {slug} ne postoji</Container>;
  }

  return (
    <TitleTemplate
      title={`${actor.firstName} ${actor.lastName} ${
        actor.nickname ? ` - ${actor.nickname}` : ""
      } ${actor.age ? ` (${actor.age})` : ""}`}
      description={actor.bio ? actor.bio : ""}
      contained
    >
      {actor.videos.length > 0 ? (
        <>
          <p className="text-xl font-bold mt-10">
            Videi u kojima se{" "}
            {actor.nickname
              ? actor.nickname
              : `${actor.firstName} ${actor.lastName}`}{" "}
            pojavljuje:
          </p>
          <div className="grid grid-cols-2 mt-3 gap-4">
            {actor.videos.map((video) => (
              <VideoDetail key={video.id} video={video} showCategories />
            ))}
          </div>
        </>
      ) : (
        <div>
          Nema videa sa {actor.gender === "female" ? "gošćom" : "gostom"}
        </div>
      )}
    </TitleTemplate>
  );
}
