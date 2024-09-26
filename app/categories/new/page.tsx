import { CategoryForm } from "@/components/category-form";
import { Container } from "@/components/container";
import { auth } from "auth";
import { AccessDenied } from "@/components/access-denied";

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

  if (!session?.user) return <AccessDenied />;

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <CategoryForm />
    </Container>
  );
}
