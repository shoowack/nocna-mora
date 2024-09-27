import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/container";

export default async function CategoryPage({ params }) {
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug: slug },
    include: {
      // createdBy: true,
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
      {category.videos.length > 0 && (
        <>
          <p className="text-xl font-bold mt-10">
            Videi u {category.title} Kategoriji:
          </p>
          <div className="grid grid-cols-2 mt-3 gap-4">
            {category.videos.map((video) => (
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
