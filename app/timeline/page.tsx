import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TitleTemplate } from "@/components/title-template";
import { ParticipantGender } from "@prisma/client";
import {
  Baby,
  Calendar,
  ExternalLink,
  Newspaper,
  Play,
  Skull,
  Youtube,
} from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Vremenska linija | Noćna Mora",
    description:
      "Pogledajte vremensku liniju događaja emisije Noćna Mora, uključujući rođenja i smrti sudionika te emitiranja epizoda.",
    openGraph: {
      title: "Vremenska linija | Noćna Mora",
      description:
        "Pogledajte vremensku liniju događaja emisije Noćna Mora, uključujući rođenja i smrti sudionika te emitiranja epizoda.",
    },
  };
}

type TimelineEvent = {
  type: "birth" | "death" | "video" | "custom";
  date: Date | null;
  title: string;
  id?: string;
  icon?: ReactNode;
  description?: ReactNode;
};

export default async function TimelinePage() {
  const participants = await prisma.participant.findMany({
    select: {
      firstName: true,
      lastName: true,
      gender: true,
      birthDate: true,
      deathDate: true,
      nickname: true,
    },
  });

  // Fetch all videos with airedDate
  const videos = await prisma.video.findMany({
    select: {
      title: true,
      airedDate: true,
      id: true,
    },
  });

  // Map participants' birth and death into events
  const participantEvents: TimelineEvent[] = participants.flatMap(
    (participant) => {
      const events: TimelineEvent[] = [];

      if (participant.birthDate) {
        events.push({
          type: "birth",
          date: participant.birthDate,
          title: `${
            participant.gender === ParticipantGender.MALE ? "Rođen" : "Rođena"
          } ${participant.firstName} ${participant.lastName} ${
            participant.nickname ? ` (${participant.nickname})` : ""
          }`,
        });
      }
      if (participant.deathDate) {
        events.push({
          type: "death",
          date: participant.deathDate,
          title: `${
            participant.gender === ParticipantGender.MALE
              ? "Preminuo"
              : "Preminula"
          } ${participant.firstName} ${participant.lastName} ${
            participant.nickname ? ` (${participant.nickname})` : ""
          }`,
        });
      }
      return events;
    }
  );

  // Map videos into events
  const videoEvents: TimelineEvent[] = videos.map((video) => ({
    type: "video",
    date: video.airedDate,
    title: `"${video.title}" emisija emitirana`,
    id: video.id,
  }));

  const customEvents = [
    {
      type: "custom",
      date: new Date("11 19 2020"),
      id: "seva-mural-knezija",
      title:
        "Zagreb: Navijači Dinama na Knežiji izradili mural u čast Ševi iz Noćne More",
      icon: <Calendar className="size-4" />,
      description: (
        <div className="relative mt-5 h-[350px] min-w-full">
          <Image
            src="/timeline/seva-mural.jpg"
            alt="Zagreb: Navijači Dinama na Knežiji izradili mural u čast Ševi iz Noćne More"
            objectFit="cover"
            fill
          />
        </div>
      ),
    },
    {
      type: "custom",
      date: new Date("01 10 2017"),
      id: "24-sata-da-nije-bilo-spasitelja-malnara",
      icon: <Newspaper className="size-4" strokeWidth={2.5} />,
      title:
        "'Da nije bilo spasitelja Malnara, mi bismo danas čistili ulice...'",
      description: (
        <Link
          href="https://www.24sata.hr/show/da-nije-bilo-spasitelja-malnara-mi-bismo-danas-cistili-ulice-542196"
          target="_blank"
          className="w-auto"
        >
          <Button className="mt-2 flex gap-2">
            <ExternalLink className="inline-block size-4" />
            Pročitaj članak
          </Button>
        </Link>
      ),
    },
    // Video example
    // {
    //   type: "custom",
    //   date: new Date(),
    //   id: "today",
    //   icon: <Calendar className="size-4" />,
    //   description: (
    //     <iframe
    //       className="aspect-video w-full"
    //       src="https://www.youtube.com/embed/7egdtOI0J2U?si=eKH-mQzQsPGMR46A"
    //       title="YouTube video player"
    //       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    //       referrerPolicy="strict-origin-when-cross-origin"
    //       allowFullScreen
    //     />
    //   ),
    // },
  ];

  // Combine and sort by date
  const timelineEvents = [
    ...participantEvents,
    ...videoEvents,
    ...customEvents,
  ].sort(
    (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime() // Ensure non-null dates
  );

  return (
    <TitleTemplate title="Vremenska linija" contained>
      <div className="relative space-y-8 py-10 before:absolute before:inset-0 before:ml-5 before:h-full before:w-1 before:-translate-x-px before:[background-image:linear-gradient(to_bottom,transparent_0px,rgb(240_240_240)_30px,rgb(240_240_240)_calc(100%_-_30px),transparent_100%)] md:before:mx-auto md:before:translate-x-0">
        {timelineEvents.map((event, index) => {
          return (
            <div
              key={index}
              className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white bg-stone-200 text-stone-500 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
                  {
                    "bg-stone-800 text-stone-100": event.type === "death",
                    "bg-blue-200 text-blue-800 ": event.type === "birth",
                    "bg-red-200 text-red-800 ": event.type === "video",
                  }
                )}
              >
                {event.type === "birth" ? (
                  <Baby className="size-5" strokeWidth={2} />
                ) : event.type === "death" ? (
                  <Skull className="size-5" strokeWidth={2} />
                ) : event.type === "video" ? (
                  <Youtube className="size-5" strokeWidth={2} />
                ) : event.icon ? (
                  event.icon
                ) : (
                  ""
                )}
              </div>

              <div
                className={cn(
                  "w-[calc(100%-4rem)] rounded-xl bg-stone-100 p-4 md:w-[calc(50%-2.5rem)] relative",
                  {
                    "bg-stone-200 text-stone-900": event.type === "death",
                    "bg-blue-100/50 text-blue-800 ": event.type === "birth",
                    "bg-red-100/50 text-red-800 ": event.type === "video",
                  }
                )}
              >
                <div className="mb-1 flex flex-col items-start justify-between md:flex-row md:space-x-2">
                  {event.title && (
                    <div className="font-bold">{event.title}</div>
                  )}
                  {event.date && (
                    <time className="mt-1.5 whitespace-nowrap text-xs opacity-50">
                      {new Date(event.date).toLocaleString("hr-HR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                </div>
                <div className="text-stone-500">
                  {event.description && event.description}
                  {event.type === "video" && (
                    // @ts-ignore next-line
                    <Link href={`/video/${event.id}`}>
                      <Button className="mt-2">
                        <Play className="mr-2 size-3.5" />
                        Video
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="flex flex-col gap-4">
         <h3></h3>
         
       </div>
     );
   <button onClick={loadMore}>Load More</button>
 </div> */}
    </TitleTemplate>
  );
}
