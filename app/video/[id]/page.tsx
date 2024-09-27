import prisma from "@/lib/prisma";
import { Container } from "@/components/container";
import { VideoDetail } from "@/components/video-detail";

export default async function VideoPage({ params }) {
  const { id } = params;

  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      categories: true,
      actors: true,
      createdBy: true,
    },
  });

  if (!video) {
    return <div>video not found</div>;
  }

  return (
    <Container>
      <VideoDetail video={video} singleVideo showCategories showActors />
    </Container>
  );
}
