import { ActorForm } from "@/components/actor-form";
import { auth } from "auth";
import { SessionProvider } from "next-auth/react";
import { AccessDenied } from "@/components/access-denied";
import { Container } from "@/components/container";

export default async function NewActorPage() {
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

  if (!session?.user) return <AccessDenied />;

  return (
    <SessionProvider basePath={"/auth"} session={session}>
      <Container>
        <h1 className="text-2xl font-bold mb-4">Add New Actor</h1>
        <ActorForm />
      </Container>
    </SessionProvider>
  );
}
