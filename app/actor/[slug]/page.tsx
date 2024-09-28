import prisma from "@/lib/prisma";
import TitleTemplate from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { ActorType } from "@prisma/client";
import { Container } from "@/components/container";

export default async function ActorPage({ params }) {
  const { slug } = params;

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

  return (
    <TitleTemplate
      title={`${actor.firstName} ${actor.lastName} ${
        actor.nickname ? ` - ${actor.nickname}` : ""
      } ${actor.age ? ` (${actor.age})` : ""}`}
      description={actor.bio ? actor.bio : ""}
    >
      {actor.videos.length > 0 ? (
        <>
          <p className="text-xl font-bold mt-10">
            Videi u kojima se {actor.nickname ?? actor.firstName} pojavljuje:
          </p>
          <div className="grid grid-cols-2 mt-3 gap-4">
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
