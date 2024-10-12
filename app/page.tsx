import { VideoGallery } from "@/components/video-gallery";
import { Container } from "@/components/container";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Videotape } from "lucide-react";

const VideoGallerySkeleton = () => {
  return (
    <div className="bg-stone-100">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-2.5">
            <Videotape className="size-6 stroke-red-600" strokeWidth={2} />
            <p className="text-lg font-bold sm:text-xl">Najnovije epizode</p>
          </div>
          <div className="h-9 w-24 animate-pulse rounded-md bg-stone-200" />
        </div>
        <Separator className="mb-10 mt-2" />

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from(Array(4)).map((id) => (
            <div
              key={id}
              className="w-full animate-pulse overflow-hidden rounded-lg bg-stone-200/50"
            >
              <div className="h-36 w-full bg-stone-200" />
              <div className="space-y-4 p-4">
                <div className="h-7 w-full rounded-md bg-stone-100" />
                <div className="h-5 w-3/4 rounded-md bg-stone-100" />
                <div className="h-5 w-1/2 rounded-md bg-stone-100" />
                <Separator className="w-full bg-stone-100" />
                <div className="h-5 w-1/2 rounded-md bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default async function Index() {
  return (
    <>
      <Container className="space-y-4">
        <h1 className="text-xl font-bold sm:text-3xl">
          Dobrodošli na arhivsku stranicu Noćne More!
        </h1>
        <p>
          Ovdje možete pronaći videozapise legendarne emisije &quot;Noćna
          Mora&quot;, s dodatnim informacijama o likovima, događajima i ključnim
          trenucima iz emisije. Svaki video je pažljivo označen za lakšu
          pretragu i filtriranje kako biste brzo pronašli omiljene trenutke.
          Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su
          ostavile traga u povijesti hrvatske televizije.
        </p>
        <p>
          Pronađite svoje omiljene likove, scene i emisije na brz i jednostavan
          način koristeći pretragu.
        </p>
      </Container>
      <Suspense fallback={<VideoGallerySkeleton />}>
        <VideoGallery />
      </Suspense>
    </>
  );
}
