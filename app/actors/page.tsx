// "use client";

// import { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomLink } from "@/components/custom-link";
import { ActorType } from "@prisma/client";
import { TitleTemplate } from "@/components/title-template";

export default async function Actors() {
  const actors = await prisma.actor.findMany({
    where: { type: ActorType.MAIN },
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
          <Button>Novi lik</Button>
        </Link>
      }
    >
      {actors ? (
        <div className="flex flex-col space-y-10">
          {actors?.map((actor) => (
            <div className="flex flex-col space-y-2">
              <CustomLink
                href={`/actor/${actor.slug}`}
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
        <div>Actors not found</div>
      )}
    </TitleTemplate>
  );
}
