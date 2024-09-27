import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Container } from "@/components/container";
import { auth } from "auth";

export default async function CategoriesPage() {
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

  const categories = await prisma.category.findMany();

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Kategorije</h1>
      {session?.user && (
        <Link href="/category/new" className="btn btn-primary mb-4">
          Add New Category
        </Link>
      )}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/category/${category.slug}`}>{category.title}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
