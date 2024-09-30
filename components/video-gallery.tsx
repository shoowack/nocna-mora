import prisma from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Videotape } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { VideoDetail } from "@/components/video-detail";
import { Video } from "@prisma/client";
import { auth } from "auth";

export const VideoGallery = async () => {
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

  const videos = await prisma.video.findMany({
    where: isAdmin
      ? {} // No filter for admins
      : { published: true }, // Non-admins see only published videos,
    include: {
      categories: true,
      actors: true,
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!videos.length) {
    return null;
  }

  return (
    <div className="bg-neutral-100">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex flex-row gap-2.5 items-center">
            <Videotape className="stroke-red-600 size-6" strokeWidth={2} />
            <p className="text-xl font-bold">Najnovije epizode</p>
          </div>
          <Button size={"sm"} disabled>
            Prikaži sve
          </Button>
        </div>
        <Separator className="mt-2 mb-10" />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 xl:grid-cols-4">
          {videos.map((video: Video) => (
            <div
              key={video.id}
              className="bg-neutral-200 rounded-lg overflow-hidden"
            >
              <VideoDetail video={video} showActors showCategories />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
