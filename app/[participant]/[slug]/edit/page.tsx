import prisma from "@/lib/prisma";
import { auth } from "auth";
import { SessionProvider } from "next-auth/react";
import { TitleTemplate } from "@/components/title-template";
import { calculateAge } from "@/lib/date";
// import { AccessDenied } from "@/components/access-denied";
import { ParticipantForm } from "@/components/participant-form";
import { redirect } from "next/navigation";

export default async function EditParticipantPage({
  params: { participant: participantTypeProp, slug },
}: {
  params: { participant: string; slug: string };
}) {
  const session = await auth();

  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role,
    };
  }

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  const participant = await prisma.participant.findUnique({
    where: { slug },
  });

  if (!participant) {
    return <div>Participant not found</div>;
  }

  // if (!session?.user) return <AccessDenied />;

  return (
    <SessionProvider basePath={"/auth"} session={session}>
      <TitleTemplate
        title={`Ažuriraj ${participant.firstName} ${participant.lastName} ${
          participant.nickname ? ` - ${participant.nickname}` : ""
        } ${
          participant.birthDate
            ? ` (${calculateAge(participant.birthDate, participant.deathDate)})`
            : ""
        }`}
        contained
      >
        <ParticipantForm
          participantData={participant}
          guest={participantTypeProp === "guest"}
        />
      </TitleTemplate>
    </SessionProvider>
  );
}
