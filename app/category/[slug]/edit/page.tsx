import prisma from "@/lib/prisma";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/category-form";
import { TitleTemplate } from "@/components/title-template";

export default async function EditCategoryPage({
  params,
}: {
  params: { slug: string };
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

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <TitleTemplate title="Ažuriraj kategoriju" contained>
      <CategoryForm category={category} />
    </TitleTemplate>
  );
}
