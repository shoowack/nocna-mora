import { VideoForm } from "@/components/video-form";
import { TitleTemplate } from "@/components/title-template";
import { auth } from "auth";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function NewVideoPage() {
  const session = await auth();

  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <SessionProvider basePath={"/auth"} session={session}>
      <TitleTemplate title="Dodaj novi video" contained>
        <VideoForm />
      </TitleTemplate>
    </SessionProvider>
  );
}
