import prisma from "@/lib/prisma";
import Link from "next/link";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Pagination } from "@/components/pagination";
import { Search } from "@/components/search";
import { FilterControls } from "@/components/filter-controls";
import { auth } from "auth";
import { VideoProvider } from "@prisma/client";
import { pageSizeConstants } from "@/app/constants/page-size-constants";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: {
    query?: string;
    page?: string;
    provider?: VideoProvider;
    duration?: string;
    participants?: string;
    pageSize?: string;
  };
}) {
  const { slug } = params;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const provider = searchParams?.provider || "";
  const duration = searchParams?.duration || "";
  const participants = searchParams?.participants
    ? searchParams.participants.split(",")
    : [];
  const pageSize = Number(searchParams?.pageSize) || pageSizeConstants[0];

  const session = await auth();

  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role,
    };
  }

  const isAdmin = session?.user?.role === "admin";

  const participantsFilter = participants.length
    ? participants.map((participant) => ({
        participants: {
          some: {
            slug: participant,
          },
        },
      }))
    : undefined;

  const [category, totalVideos, totalVideosWithoutFilters] = await Promise.all([
    prisma.category.findUnique({
      where: { slug, deletedAt: null },
      include: {
        createdBy: true,
        videos: {
          include: {
            participants: true,
          },
          where: {
            published: isAdmin ? undefined : true,
            title: query ? { contains: query, mode: "insensitive" } : undefined,
            provider: provider || undefined,
            duration:
              duration === "short"
                ? { lte: 300 }
                : duration === "long"
                ? { gt: 300 }
                : undefined,
            AND: participantsFilter,
            // To show videos with any of the selected participants
            // participants: participants.length
            //   ? {
            //       some: {
            //         slug: { in: participants },
            //       },
            //     }
            //   : undefined,
          },
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),
    prisma.video.count({
      where: {
        categories: {
          some: {
            slug,
          },
        },
        published: isAdmin ? undefined : true,
        title: query ? { contains: query, mode: "insensitive" } : undefined,
        provider: provider || undefined,
        duration:
          duration === "short"
            ? { lte: 300 }
            : duration === "long"
            ? { gt: 300 }
            : undefined,
        AND: participantsFilter,
        // To show videos with any of the selected participants
        // participants: participants.length
        //   ? {
        //       some: {
        //         slug: { in: participants },
        //       },
        //     }
        //   : undefined,
      },
    }),
    // Count the total number of videos without any filters for this category
    prisma.video.count({
      where: {
        categories: {
          some: {
            slug,
          },
        },
        published: isAdmin ? undefined : true,
      },
    }),
  ]);

  if (!category) {
    return (
      <Container className="flex justify-center">
        <div className="flex h-[calc(100vh-18rem)] flex-col items-center justify-center pb-10 pt-20">
          <div className="mb-5 text-2xl">
            Kategorija <span className="font-bold">&quot;{slug}&quot;</span> ne
            postoji
          </div>
          <Link href="/categories">
            <Button>Natrag na kategorije</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <TitleTemplate
      title={category?.title}
      description={category?.description}
      contained
      containedClassNames="px-4 py-4 sm:px-6 md:py-2 flex"
      button={
        <Link href={`/category/${category?.slug}/edit`}>
          <Button className="w-full">Ažuriraj kategoriju</Button>
        </Link>
      }
    >
      {totalVideosWithoutFilters === 0 ? (
        // No videos at all in the category
        <div className="flex grow items-center justify-center pb-10 pt-20">
          <div>
            Trenutno nema videa u ovoj kategoriji. Provjerite ponovno kasnije
            ili istražite
            <Link href="/categories" className="ml-1 underline">
              druge kategorije
            </Link>
            .
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col justify-stretch">
          <div className="flex items-center justify-between gap-2">
            <Search placeholder="Search videos..." />
            <FilterControls initialParticipants={participants} />
          </div>
          {totalVideos === 0 ? (
            // No videos matching the filter/search criteria
            <div className="flex grow items-center justify-center pb-10 pt-20">
              <div>
                Nema videa koji odgovaraju trenutnim kriterijima pretrage ili
                filtra. Pokušajte promijeniti kriterije.
              </div>
            </div>
          ) : (
            <>
              <p className="mt-10 text-xl font-bold">
                {duration
                  ? `${duration === "short" ? "Kratki" : "Dugački"} v`
                  : "V"}
                idei u kategoriji {category.title.toLowerCase()}
                {query ? ` sa terminom "${query}"` : ""}
                {provider ? ` sa ${provider} servisa` : ""}:
              </p>
              <div className="mt-3 grid flex-1 gap-4 sm:grid-cols-2">
                {category.videos.map((video) => (
                  <div key={video.id}>
                    <VideoDetail video={video} showActors />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex w-full">
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalVideos={totalVideos}
                />
              </div>
            </>
          )}
        </div>
      )}
    </TitleTemplate>
  );
}
