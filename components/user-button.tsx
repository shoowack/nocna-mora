import {
  Avatar,
  // AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Button } from "./ui/button";
import { auth } from "auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignIn, SignOut } from "@/components/auth-components";
import { ChevronDown } from "lucide-react";

export const UserButton = async () => {
  const session = await auth();
  if (!session?.user) return <SignIn />;

  return (
    <div className="flex items-center gap-2">
      {/* <span className="hidden text-sm sm:inline-flex">
        {session.user.email}
      </span> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-16 rounded-full">
            <ChevronDown className="mx-2 size-4 min-w-4 stroke-stone-900" />
            <Avatar className="size-8">
              <AvatarImage
                src={
                  session.user.image ??
                  `https://api.dicebear.com/9.x/thumbs/svg?seed=${
                    Math.floor(Math.random() * 100000) + 1
                  }&randomizeIds=true`
                }
                alt={session.user.name ?? ""}
              />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="p-3 font-normal">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-stone-500">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <SignOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
