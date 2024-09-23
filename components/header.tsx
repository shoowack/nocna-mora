import { MainNav } from "./main-nav";
import { Container } from "@/components/container";
import { UserButton } from "@/components/user-button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex justify-center border-b bg-white">
      <Container className="flex h-16 items-center justify-between md:py-6">
        <MainNav />
        <UserButton />
      </Container>
    </header>
  );
};
