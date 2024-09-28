import { auth } from "auth";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/category-form";
import { TitleTemplate } from "@/components/title-template";
// import { AccessDenied } from "@/components/access-denied";

export default async function NewCategoryPage() {
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

  // if (!session?.user) return <AccessDenied />;

  return (
    <TitleTemplate title="Dodaj novu kategoriju">
      <CategoryForm />
    </TitleTemplate>
  );
}
