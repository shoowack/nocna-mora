"use client";

import React, { useEffect, useState } from "react";
// import prisma from "@/lib/prisma";
import { CategoryForm } from "@/components/category-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();

  //   const category = await prisma.category.findUnique({
  //     where: { slug: params.slug },
  //   });

  const [category, setCategory] = useState([]);

  useEffect(() => {
    fetch(`/api/category/${params.slug}`)
      .then((res) => res.json())
      .then((data) => setCategory(data.category));
  }, []);

  if (!category) {
    return <div>Category not found</div>;
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this category?")) {
      const response = await fetch(`/api/category/${params.slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/categories");
      } else {
        // Handle error
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <CategoryForm category={category} />
      <Button variant="destructive" onClick={handleDelete}>
        Delete Category
      </Button>
    </div>
  );
}
