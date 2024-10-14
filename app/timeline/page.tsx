import prisma from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TitleTemplate } from "@/components/title-template";
import { ParticipantGender } from "@prisma/client";
import {
  Baby,
  Play,
  // Settings,
  Skull,
  Youtube,
} from "lucide-react";

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
  const participantEvents = participants.flatMap((participant) => {
    const events = [];

    if (participant.birthDate) {
      events.push({
        type: "birth",
        date: participant.birthDate,
        title: `${
          participant.gender === ParticipantGender.MALE ? "Rođen" : "Rođena"
        } ${participant.firstName} ${participant.lastName} ${
          participant.nickname && ` (${participant.nickname})`
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
  });

  // Map videos into events
  const videoEvents = videos.map((video) => ({
    type: "video",
    date: video.airedDate,
    title: `"${video.title}" emisija emitirana`,
    id: video.id,
  }));

  // eslint-disable-next-line no-unused-vars
  const customEvents = [
    // {
    //   type: "custom",
    //   date: new Date(),
    //   id: "today",
    //   icon: <Settings className="size-4" />,
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
    // ...customEvents,
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
                  "flex size-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white bg-slate-300 text-slate-500 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
                  {
                    "bg-slate-800 text-slate-100": event.type === "death",
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
                ) : (
                  // ) : event.icon ? (
                  //   event.icon
                  ""
                )}
              </div>

              <div
                className={cn(
                  "w-[calc(100%-4rem)] rounded-xl bg-stone-100 p-4 md:w-[calc(50%-2.5rem)] relative",
                  {
                    "bg-slate-200 text-slate-900": event.type === "death",
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
                    <time className="whitespace-nowrap opacity-50">
                      {new Date(event.date).toLocaleString("hr-HR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                </div>
                <div className="text-slate-500">
                  {/* {event.description && <p>{event.description}</p>} */}
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
