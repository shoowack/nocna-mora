import Link from "next/link";
import { headers } from "next/headers";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { getPayload } from "@/lib/payload";
import { Media } from "../../payload-types";
import Image from "next/image";

export async function Header() {
  const payload = await getPayload();
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });
  let logoUrl: string | undefined;

  try {
    const siteSettings = await payload.findGlobal({ slug: "site-settings" });
    const logo = siteSettings?.logo as Media | null | undefined;
    if (logo?.url) logoUrl = logo.url;
  } catch {
    // fall through to static favicon
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          {logoUrl ? (
            <div className="relative h-10 w-40">
              <Image
                src={logoUrl}
                alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Logo`}
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          ) : (
            process.env.NEXT_PUBLIC_SITE_NAME
          )}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/video"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Videi
          </Link>
          <Link
            href="/glumci"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Glumci
          </Link>
          <Link
            href="/gosti"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Gosti
          </Link>
          <Link
            href="/kategorije"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Kategorije
          </Link>
          <Link
            href="/vremenska-crta"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Vremenska crta
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/pretraga"
            className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Pretraži...</span>
          </Link>
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/profil"
                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {user.name}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/prijava"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Prijava
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
