import prisma from "@/lib/prisma";
import { Container } from "@/components/container";
import { VideoDetail } from "@/components/video-detail";

export default async function CategoryPage({ params }) {
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug: slug },
    include: {
      createdBy: true,
      videos: true,
    },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold">
        {category.title ? category.title : ""}
      </h1>
      {category.description && (
        <p className="text-md mt-2">
          {category.description ? category.description : ""}
        </p>
      )}
      {category.videos.length > 0 ? (
        <>
          <p className="text-xl font-bold mt-10">
            Videi u {category.title} Kategoriji:
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
        <div className="flex h-[calc(100vh-18rem)] justify-center items-center pt-20 pb-10">
          Trenutno nema videa u ovoj kategoriji. Provjerite ponovno kasnije ili
          istražite druge kategorije.
        </div>
        // "No videos in this category yet. Please check back later."
      )}
    </Container>
  );
}
