import prisma from "@/lib/prisma";
import { Container } from "@/components/container";
import { VideoDetail } from "@/components/video-detail";
import { ActorType } from "@prisma/client";

export default async function ActorPage({ params }) {
  const { slug } = params;

  const actor = await prisma.actor.findUnique({
    where: { slug, type: ActorType.GUEST },
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
    return <div>Actor not found</div>;
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold">
        {actor.firstName} {actor.lastName}
        {actor.nickname ? ` - ${actor.nickname}` : ""}
        {actor.age ? ` (${actor.age})` : ""}
      </h1>
      <p className="text-sm mt-2">{actor.bio ? actor.bio : ""}</p>
      {actor.videos.length > 0 && (
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
      )}
    </Container>
  );
}
