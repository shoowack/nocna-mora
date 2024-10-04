import { ParticipantForm } from "@/components/participant-form";
import { auth } from "auth";
import { SessionProvider } from "next-auth/react";
// import { AccessDenied } from "@/components/access-denied";
import { redirect } from "next/navigation";
import { TitleTemplate } from "@/components/title-template";

export default async function NewParticipantPage({
  params: { participant: participantTypeProp },
}: {
  params: { participant: string };
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

  // if (!session?.user) return <AccessDenied />;

  return (
    <SessionProvider basePath={"/auth"} session={session}>
      <TitleTemplate
        title={`Dodaj novog ${
          participantTypeProp === "actor" ? "lika" : "gosta"
        }`}
        contained
      >
        <ParticipantForm guest={participantTypeProp === "guest"} />
      </TitleTemplate>
    </SessionProvider>
  );
}
