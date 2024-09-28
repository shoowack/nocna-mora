// "use client";
import prisma from "@/lib/prisma";
import { Container } from "@/components/container";
import { CustomLink } from "@/components/custom-link";
import { ActorType } from "@prisma/client";
// import { useEffect, useState } from "react";

export default async function Actors({ params }) {
  // export default function Actors() {
  // const [data, setData] = useState();

  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch("/api/actors");
  //     const json = await res.json();

  //     setData(json);
  //   })();
  // }, []);
  const actors = await prisma.actor.findMany({
    where: { type: ActorType.GUEST },
    orderBy: {
      lastName: "asc",
    },
  });

  // const actor = await prisma.actor.findUnique({
  //   where: { slug: slug },
  //   include: {
  //     createdBy: true,
  //     videos: true,
  //   },
  // });

  if (!actors) {
    return <div>Guests not found</div>;
  }

  return (
    <Container>
      {actors && (
        <div className="flex flex-col space-y-10">
          {actors?.map((actor) => (
            <div className="flex flex-col space-y-2">
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
      )}
    </Container>
  );
}
