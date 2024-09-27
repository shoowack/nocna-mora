import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/container";

export default async function ActorPage({ params }) {
  const { slug } = params;

  const actor = await prisma.actor.findUnique({
    where: { slug },
    include: {
      createdBy: true,
      videos: true,
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
              <div key={video.id}>
                <h2 className="text-md font-bold">{video.title}</h2>
                <iframe
                  className="aspect-video w-full my-2"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                {video.airedDate ? (
                  <Badge variant="secondary">
                    {new Date(video.airedDate).toLocaleString("hr-HR", {
                      timeZone: "UTC",
                      //   weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Badge>
                ) : (
                  <div className="h-6" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
