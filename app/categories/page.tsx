import prisma from "@/lib/prisma";
import Link from "next/link";
import { TitleTemplate } from "@/components/title-template";
import { Button } from "@/components/ui/button";
import { CustomLink } from "@/components/custom-link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
  });

  return (
    <TitleTemplate
      title="Kategorije"
      contained
      button={
        <Link href="/category/new">
          <Button>Nova kategorija</Button>
        </Link>
      }
    >
      {categories.length ? (
        <div className="flex flex-col space-y-10">
          {categories.map((category) => (
            <div className="flex flex-col space-y-2">
              <CustomLink
                href={`/category/${category.slug}`}
                className="text-xl font-bold"
                key={category.id}
              >
                {category.title && category.title}
              </CustomLink>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>Guests not found</div>
      )}
    </TitleTemplate>
  );
}
