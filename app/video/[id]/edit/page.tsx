import prisma from "@/lib/prisma";
import { VideoForm } from "@/components/video-form";
import { TitleTemplate } from "@/components/title-template";

export default async function EditVideoPage({
  params,
}: {
  params: { id: string };
}) {
  const video = await prisma.video.findUnique({
    where: { id: params.id },
    include: {
      categories: true,
      actors: true,
      createdBy: true,
    },
  });

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <TitleTemplate title={`Edit video ${video.title}`} contained>
      <VideoForm video={video} />
    </TitleTemplate>
  );
}
