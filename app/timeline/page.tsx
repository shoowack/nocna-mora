// import prisma from "@/lib/prisma";

export default function TimelinePage() {
  //   const participants = await prisma.participant.findMany({
  //     select: {
  //       firstName: true,
  //       lastName: true,
  //       birthDate: true,
  //       deathDate: true,
  //     },
  //   });

  //   // Fetch all videos with airedDate
  //   const videos = await prisma.video.findMany({
  //     select: {
  //       title: true,
  //       airedDate: true,
  //     },
  //   });

  //   // Map participants' birth and death into events
  //   const participantEvents = participants.flatMap((participant) => {
  //     const events = [];
  //     if (participant.birthDate) {
  //       events.push({
  //         type: "birth",
  //         date: participant.birthDate,
  //         title: `${participant.firstName} ${participant.lastName} was born`,
  //       });
  //     }
  //     if (participant.deathDate) {
  //       events.push({
  //         type: "death",
  //         date: participant.deathDate,
  //         title: `${participant.firstName} ${participant.lastName} passed away`,
  //       });
  //     }
  //     return events;
  //   });

  //   // Map videos into events
  //   const videoEvents = videos.map((video) => ({
  //     type: "video",
  //     date: video.airedDate,
  //     title: `${video.title} aired`,
  //   }));

  //   // Combine and sort by date
  //   // eslint-disable-next-line no-unused-vars
  //   const timelineEvents = [...participantEvents, ...videoEvents].sort(
  //     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  //   );

  return <div>TimelinePage</div>;
}
