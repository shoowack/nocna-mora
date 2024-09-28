import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Container } from "@/components/container";
import { auth } from "auth";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Kategorije</h1>
        {session?.user && <Button href="/category/new">Nova Kategorija</Button>}
      </div>
      <Separator />
      {categories.length && (
        <div className="flex flex-col space-y-5 mt-10">
          {categories.map((category) => (
            <div key={category.id}>
              <Link href={`/category/${category.slug}`} className="text-lg">
                {category.title}
              </Link>
              <p className="text-sm">{category.description}</p>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
