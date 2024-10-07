import { ReactNode } from "react";
import { auth } from "auth";
import { Container } from "@/components/container";
import { Separator } from "./ui/separator";

export async function TitleTemplate({
  title,
  description,
  children,
  button,
  contained = false,
}: {
  title?: string | ReactNode;
  description?: string | null;
  children: ReactNode;
  button?: ReactNode;
  contained?: boolean;
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

  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <div className="bg-neutral-100">
        <Container className="md:py-10">
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="flex flex-col">
              {title && (
                <h1 className="text-lg font-bold sm:text-2xl">{title}</h1>
              )}
              {description && (
                <p className="mt-2 text-sm">{description ? description : ""}</p>
              )}
            </div>
            {isAdmin && button && (
              <Separator className="my-4 block sm:hidden" />
            )}

            {isAdmin && button}
          </div>
        </Container>
      </div>
      {contained ? <Container>{children}</Container> : children}
    </>
  );
}
