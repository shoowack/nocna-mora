import { ReactNode } from "react";
import { auth } from "auth";
import { Container } from "@/components/container";

export async function TitleTemplate({
  title,
  description,
  children,
  button,
  contained = false,
}: {
  title?: string;
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
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{title ? title : ""}</h1>
              {description && (
                <p className="text-sm mt-2">{description ? description : ""}</p>
              )}
            </div>

            {isAdmin && button}
          </div>
        </Container>
      </div>
      {contained ? <Container>{children}</Container> : children}
    </>
  );
}
