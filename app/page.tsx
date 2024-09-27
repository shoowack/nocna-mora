import { VideoGallery } from "@/components/video-gallery";
import { Container } from "@/components/container";

export default async function Index() {
  return (
    <>
      <Container className="space-y-4">
        <h1 className="text-3xl font-bold">
          Dobrodošli na arhivsku stranicu Noćne More!
        </h1>
        <p>
          Ovdje možete pronaći videozapise legendarne emisije "Noćna Mora", s
          dodatnim informacijama o likovima, događajima i ključnim trenucima iz
          emisije. Svaki video je pažljivo označen za lakšu pretragu i
          filtriranje kako biste brzo pronašli omiljene trenutke. Pregledajte i
          istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u
          povijesti hrvatske televizije.
        </p>
        <p>
          Pronađite svoje omiljene likove, scene i emisije na brz i jednostavan
          način koristeći pretragu.
        </p>
      </Container>
      <VideoGallery />
    </>
  );
}
