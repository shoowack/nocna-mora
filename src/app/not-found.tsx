export const dynamic = 'force-dynamic'

import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <html lang="hr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4 py-24 text-center">
              <div>
                <h1 className="mb-2 text-8xl font-bold text-primary">404</h1>
                <h2 className="mb-4 text-2xl font-bold text-foreground">
                  Stranica nije pronađena
                </h2>
                <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                  Stranica koju tražite ne postoji. Moguće je da je uklonjena ili
                  da ste unijeli krivi URL.
                </p>
                <Link
                  href="/"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Povratak na početnu
                </Link>
              </div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
