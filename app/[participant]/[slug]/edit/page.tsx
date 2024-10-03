import prisma from "@/lib/prisma";
import { auth } from "auth";
import { SessionProvider } from "next-auth/react";
import { TitleTemplate } from "@/components/title-template";
import { calculateAge } from "@/lib/date";
// import { AccessDenied } from "@/components/access-denied";
import { ActorForm } from "@/components/actor-form";
import { redirect } from "next/navigation";

export default async function EditParticipantPage({
  params: { participant, slug },
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

  const actor = await prisma.actor.findUnique({
    where: { slug },
  });

  if (!actor) {
    return <div>Actor not found</div>;
  }

  // if (!session?.user) return <AccessDenied />;

  return (
    <SessionProvider basePath={"/auth"} session={session}>
      <TitleTemplate
        title={`Ažuriraj ${actor.firstName} ${actor.lastName} ${
          actor.nickname ? ` - ${actor.nickname}` : ""
        } ${
          actor.birthDate
            ? ` (${calculateAge(actor.birthDate, actor.deathDate)})`
            : ""
        }`}
        contained
      >
        <ActorForm actorData={actor} guest={participant === "guest"} />
      </TitleTemplate>
    </SessionProvider>
  );
}
