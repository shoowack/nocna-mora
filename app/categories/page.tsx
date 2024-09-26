import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Container } from "@/components/container";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany();

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Kategorije</h1>
      <Link href="/categories/new" className="btn btn-primary mb-4">
        Add New Category
      </Link>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/categories/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
