import { AlertTriangle, ChevronLeftIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/container";
import { SignIn, SignOut } from "@/components/auth-components";
import { Button } from "@/components/ui/button";
import { auth } from "auth";
import Link from "next/link";

export const AccessDenied = async () => {
  const session = await auth();

  return (
    <Container className="text-center flex-col flex gap-y-4 justify-center">
      <AlertTriangle
        className="mx-auto mb-5 size-20 stroke-yellow-500"
        strokeWidth={1}
      />
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl font-bold">Pristup zabranjen</h1>
        <p className="text-balance">
          Morate biti prijavljeni kao administrator da biste pristupili ovoj
          stranici
        </p>
      </div>
      {/* <p>You must be signed in with admin privileges to view this page</p> */}
      <div className="mt-4 flex justify-center gap-x-6">
        <Link href="/">
          <Button variant="outline">
            <ChevronLeftIcon className="mr-2 size-4" />
            Natrag na početnu
          </Button>
        </Link>
        <Separator className="h-12 -mt-1" orientation="vertical" />
        {session?.user ? (
          <SignOut variant="default" className="!h-auto !w-auto" />
        ) : (
          <SignIn />
        )}
        {/* <SignIn /> */}
      </div>
    </Container>
  );
};
