import Link from "next/link";
import prisma from "@/lib/prisma";
import { CustomLink } from "@/components/custom-link";
import { ParticipantType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { TitleTemplate } from "@/components/title-template";
import { Users2 } from "lucide-react";
import { NameAndAge } from "@/components/name-and-age";

export default async function Guests() {
  const participants = await prisma.participant.findMany({
    where: { type: ParticipantType.GUEST },
    orderBy: {
      lastName: "asc",
    },
  });

  return (
    <TitleTemplate
      title="Gosti"
      description="Osobe koje su gostovale u Noćnoj mori a nisu dio standardne ekipe"
      contained
      button={
        <Link href="/guest/new">
          <Button>Novi gost</Button>
        </Link>
      }
    >
      {participants.length ? (
        <div className="flex flex-col space-y-10">
          {participants?.map((participant) => (
            <div key={participant.id} className="flex flex-col space-y-2">
              <CustomLink
                href={`/guest/${participant.slug}`}
                className="text-xl font-bold"
                key={participant.id}
              >
                <NameAndAge {...participant} />
              </CustomLink>
              <p>{participant.bio}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[calc(100vh-23rem)] flex-col items-center justify-center space-y-2">
          <Users2 className="size-12" strokeWidth={1.5} />
          <div>Nema dostupnih gostiju</div>
        </div>
      )}
    </TitleTemplate>
  );
}
