import prisma from "@/lib/prisma";
import Link from "next/link";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { Button } from "@/components/ui/button";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug: slug },
    include: {
      createdBy: true,
      videos: true,
    },
  });

  return (
    <TitleTemplate
      title={category?.title}
      description={category?.description}
      newButton={
        <Link href={`/category/${category?.slug}/edit`}>
          <Button>Ažuriraj kategoriju</Button>
        </Link>
      }
    >
      {category && category.videos.length > 0 ? (
        <>
          <p className="text-xl font-bold mt-10">
            Videi u kategoriji {category.title.toLowerCase()}:
          </p>
          <div className="grid grid-cols-2 mt-3 gap-4">
            {category.videos.map((video) => (
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
