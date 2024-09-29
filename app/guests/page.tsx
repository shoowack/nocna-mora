// "use client";

// import { useEffect, useState } from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { CustomLink } from "@/components/custom-link";
import { ActorType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { TitleTemplate } from "@/components/title-template";

export default async function Actors() {
  const actors = await prisma.actor.findMany({
    where: { type: ActorType.GUEST },
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
      {actors ? (
        <div className="flex flex-col space-y-10">
          {actors?.map((actor) => (
            <div key={actor.id} className="flex flex-col space-y-2">
              <CustomLink
                href={`/guest/${actor.slug}`}
                className="text-xl font-bold"
                key={actor.id}
              >
                {`${actor.firstName} ${actor.lastName}`}{" "}
                {actor.nickname && `(${actor.nickname})`}
              </CustomLink>
              <p>{actor.bio}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>Guests not found</div>
      )}
    </TitleTemplate>
  );
}
