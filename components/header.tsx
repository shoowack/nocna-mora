import prisma from "@/lib/prisma";
import { MainNav } from "./main-nav";
import { Container } from "@/components/container";
import { UserButton } from "@/components/user-button";

export const Header = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { title: "asc" },
    where: { deletedAt: null },
  });

  return (
    <header className="sticky top-0 z-[100] flex justify-center border-b bg-white">
      <Container className="relative flex h-16 items-center justify-between md:py-6">
        <MainNav categories={categories} />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <UserButton />
        </div>
      </Container>
    </header>
  );
};
