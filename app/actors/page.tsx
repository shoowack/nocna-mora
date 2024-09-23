"use client";

import { Container } from "@/components/container";
import { CustomLink } from "@/components/custom-link";
import { useEffect, useState } from "react";

export default function Actors() {
  const [data, setData] = useState();
  console.log("data:", data);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/actors");
      const json = await res.json();

      setData(json);
    })();
  }, []);

  return (
    <Container>
      {data && (
        <div className="flex flex-col space-y-10">
          {data?.actors.map((actor) => (
            <div className="flex flex-col space-y-2">
              <CustomLink
                href={`/actors/${actor.slug}`}
                className="text-xl font-bold"
                key={actor.id}
              >{`${actor.firstName} ${actor.lastName}`}</CustomLink>
              <p>{actor.bio}</p>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
