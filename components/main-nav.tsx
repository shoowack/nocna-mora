"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Category } from "@prisma/client";

export function MainNav() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/categories");
      const json = await res.json();

      setCategories(json);
    })();
  }, []);

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
            <NavigationMenuTrigger className="px-2">
              Kategorije
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 pb-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                {categories.map((category: Category) => (
                  <ListItem
                    key={category.id}
                    href={`/category/${category.slug}`}
                    title={category.title}
                  >
                    {category.description}
                  </ListItem>
                ))}
              </ul>
              <Separator />
              <div className="flex justify-end p-3 bg-neutral-100">
                <Link href="/categories">
                  <Button variant="outline" size={"sm"}>
                    Sve kategorije
                  </Button>
                </Link>
              </div>
            </NavigationMenuContent>
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
