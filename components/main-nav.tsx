"use client";

import React from "react";
import Image from "next/image";
import { CustomLink } from "@/components/custom-link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function MainNav() {
  return (
    <div className="flex items-center gap-4">
      <CustomLink href="/">
        <Button variant="ghost" className="p-0">
          <Image
            src="/nocna-mora-logo-alt.svg"
            alt="Home"
            width="339"
            height="143"
            className="max-w-20"
          />
        </Button>
      </CustomLink>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/actors"
              className={navigationMenuTriggerStyle()}
            >
              Likovi
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/categories"
              className={navigationMenuTriggerStyle()}
            >
              Kategorije
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              // href="/memes"
              className={navigationMenuTriggerStyle()}
            >
              Memes
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              // href="/excursions"
              className={navigationMenuTriggerStyle()}
            >
              Izleti
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/guests"
              className={navigationMenuTriggerStyle()}
            >
              Gosti
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              // href="/timeline"
              className={navigationMenuTriggerStyle()}
              // className={cn(navigationMenuTriggerStyle({ variant, className }))}
              variant="disabled"
            >
              Vremenska linija
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
