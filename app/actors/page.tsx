// "use client";

// import { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomLink } from "@/components/custom-link";
import { ParticipantType } from "@prisma/client";
import { TitleTemplate } from "@/components/title-template";
import { User2 } from "lucide-react";
import { NameAndAge } from "@/components/name-and-age";

export default async function Actors() {
  const participants = await prisma.participant.findMany({
    where: { type: ParticipantType.MAIN },
    orderBy: {
      lastName: "asc",
    },
  });

  return (
    <TitleTemplate
      title="Likovi"
      contained
      button={
        <Link href="/actor/new">
          <Button className="w-full">Novi lik</Button>
        </Link>
      }
    >
      {participants.length ? (
        <div className="flex flex-col space-y-10">
          {participants?.map((participant) => (
            <div key={participant.id} className="flex flex-col space-y-2">
              <CustomLink
                href={`/actor/${participant.slug}`}
                className="text-lg font-bold sm:text-xl"
                key={participant.id}
              >
                <NameAndAge {...participant} />
              </CustomLink>
              <p className="text-sm sm:text-base">{participant.bio}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[calc(100vh-23rem)] flex-col items-center justify-center space-y-2">
          <User2 className="size-12" strokeWidth={1.5} />
          <div>Nema dostupnih likova</div>
        </div>
      )}
    </TitleTemplate>
  );
}
