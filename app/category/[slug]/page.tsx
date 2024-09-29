import prisma from "@/lib/prisma";
import Link from "next/link";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { auth } from "auth";

export default async function CategoryPage({
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
    };
  }

  const category = await prisma.category.findUnique({
    where: { slug, deletedAt: null },
    include: {
      createdBy: true,
      videos: true,
    },
  });

  // Filter videos: Show all videos if user is logged in, otherwise show only published videos
  const visibleVideos = session?.user
    ? category?.videos // Logged in users see all videos
    : category?.videos.filter((video) => video.published); // Non-logged in users see only published videos

  return !category ? (
    <Container className="flex justify-center">
      <div className="flex h-[calc(100vh-18rem)] justify-center items-center pt-20 pb-10 flex-col">
        <div className="text-2xl mb-5">
          Kategorija <span className="font-bold">&quot;{slug}&quot;</span> ne
          postoji
        </div>
        <Link href="/categories">
          <Button>Natrag na kategorije</Button>
        </Link>
      </div>
    </Container>
  ) : (
    <TitleTemplate
      title={category?.title}
      description={category?.description}
      contained
      button={
        <Link href={`/category/${category?.slug}/edit`}>
          <Button>Ažuriraj kategoriju</Button>
        </Link>
      }
    >
      {visibleVideos && visibleVideos.length > 0 ? (
        <>
          <p className="text-xl font-bold mt-10">
            Videi u kategoriji {category.title.toLowerCase()}:
          </p>
          <div className="grid grid-cols-2 mt-3 gap-4">
            {visibleVideos?.map((video) => (
              <div key={video.id}>
                <VideoDetail video={video} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-[calc(100vh-26rem)] justify-center items-center pt-20 pb-10">
          Trenutno nema videa u ovoj kategoriji. Provjerite ponovno kasnije ili
          istražite
          <Link href="/categories" className="underline ml-1">
            druge kategorije
          </Link>
          .
        </div>
        // "No videos in this category yet. Please check back later."
      )}
    </TitleTemplate>
  );
}
