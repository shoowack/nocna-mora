import prisma from "@/lib/prisma";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { Container } from "@/components/container";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "auth";
import Link from "next/link";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
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

  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      categories: true,
      actors: true,
      createdBy: true,
    },
  });

  // TODO: Add role check - unpublished videos should be accessible for authenticated admin users only
  if (!video || (!video.published && !session?.user)) {
    return (
      <Container className="text-center">
        <AlertTriangle className="mx-auto h-8 w-8 stroke-yellow-500 mb-5" />
        <h1 className="text-2xl font-bold">Video nije pronađen</h1>
        <p className="mt-5 text-balance">
          Nažalost, video koji tražite nije dostupan. Moguće je da je uklonjen
          ili da je došlo do greške u vezi. Molimo vas da provjerite URL ili
          pretražite druge videozapise klikom na gumb ispod.
        </p>
        <Link href="/videos" className="mt-10">
          <Button className="mt-10 flex items-center mx-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Povratak na videozapise
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <TitleTemplate
      title={video.title}
      button={
        <Link href={`/video/${video?.id}/edit`}>
          <Button>Ažuriraj video</Button>
        </Link>
      }
    >
      <VideoDetail video={video} singleVideo showCategories showActors />
    </TitleTemplate>
  );
}
