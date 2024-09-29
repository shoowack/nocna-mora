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
            <ChevronDown className="h-4 w-4 stroke-neutral-900 min-w-4 mx-2" />
            <Avatar className="h-8 w-8">
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
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
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
