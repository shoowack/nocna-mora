import { getPayload } from "@/lib/payload";
import { ParticipantCard } from "@/components/ParticipantCard";
import { notArchived } from "@/lib/query-helpers";

export const revalidate = 3600;

export const metadata = {
  title: "Gosti | Noćna mora Željka Malnara",
  description: "Gosti emisije",
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function GuestsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const payload = await getPayload();

  const participants = await payload.find({
    collection: "participants",
    where: { and: [{ type: { equals: "guest" } }, notArchived] },
    sort: "lastName",
    page,
    limit: 40,
    depth: 1,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Gosti</h1>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {participants.docs.map((participant: any) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            basePath="/gosti"
          />
        ))}
      </div>

      {participants.docs.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          Još nema gostiju u arhivu.
        </p>
      )}

      {/* Pagination */}
      {participants.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-4">
          {page > 1 && (
            <a
              href={`/gosti?page=${page - 1}`}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Prethodna
            </a>
          )}
          <span className="flex items-center text-sm text-muted-foreground">
            Stranica {page} od {participants.totalPages}
          </span>
          {page < participants.totalPages && (
            <a
              href={`/gosti?page=${page + 1}`}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Sljedeća
            </a>
          )}
        </div>
      )}
    </div>
  );
}
