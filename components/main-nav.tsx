"use client";

import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MenuIcon, XIcon } from "lucide-react";

export function MainNav({ categories }: { categories: Category[] }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="absolute inset-y-0 left-2 flex items-center sm:hidden">
        <Popover open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          {/* Mobile menu button */}
          <PopoverTrigger className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span className="absolute -inset-0.5" />
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <XIcon className="size-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="size-6" aria-hidden="true" />
            )}
          </PopoverTrigger>
          <PopoverContent className="ml-2 w-full list-none">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col">
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
                    href="/guests"
                    className={navigationMenuTriggerStyle()}
                  >
                    Gosti
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {categories && categories.length > 0 && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/categories"
                      className={navigationMenuTriggerStyle()}
                    >
                      Kategorije
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem className="pointer-events-none opacity-50">
                  <NavigationMenuLink
                    // href="/memes"
                    className={navigationMenuTriggerStyle()}
                  >
                    Memes
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/timeline"
                    className={navigationMenuTriggerStyle()}
                  >
                    Vremenska linija
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex shrink-0 items-center">
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
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
          <div className="flex space-x-4">
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
                    href="/guests"
                    className={navigationMenuTriggerStyle()}
                  >
                    Gosti
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {categories && categories.length > 0 && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-2">
                      Kategorije
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 pb-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        {/* Sort categories alphabetically */}
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
                      <div className="flex justify-end bg-stone-100 p-3">
                        <Link href="/categories">
                          <Button variant="outline" size={"sm"}>
                            Sve kategorije
                          </Button>
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem className="pointer-events-none opacity-50">
                  <NavigationMenuLink
                    // href="/memes"
                    className={navigationMenuTriggerStyle()}
                  >
                    Memes
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/timeline"
                    className={navigationMenuTriggerStyle()}
                  >
                    Vremenska linija
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </>
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
          <p className="line-clamp-2 text-sm leading-snug text-stone-500">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
