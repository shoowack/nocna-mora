import prisma from "@/lib/prisma";
import Link from "next/link";
import { TitleTemplate } from "@/components/title-template";
import { Button } from "@/components/ui/button";
import { CustomLink } from "@/components/custom-link";
import { Library } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { title: "asc" },
    where: { deletedAt: null },
  });

  return (
    <TitleTemplate
      title="Kategorije"
      contained
      button={
        <Link href="/category/new">
          <Button className="w-full">Nova kategorija</Button>
        </Link>
      }
    >
      {categories.length ? (
        <div className="flex flex-col space-y-10">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col space-y-2">
              <CustomLink
                href={`/category/${category.slug}`}
                className="text-lg font-bold sm:text-xl"
                key={category.id}
              >
                {category.title && category.title}
              </CustomLink>
              <p className="text-sm sm:text-base">{category.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[calc(100vh-23rem)] flex-col items-center justify-center space-y-2">
          <Library className="size-12" strokeWidth={1.5} />
          <div>Nema dostupnih kategorija</div>
        </div>
      )}
    </TitleTemplate>
  );
}
