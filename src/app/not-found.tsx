import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-8xl font-bold text-primary">404</h1>
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        Stranica nije pronađena
      </h2>
      <p className="mx-auto mb-8 max-w-md text-muted-foreground">
        Stranica koju tražite ne postoji. Moguće je da je uklonjena ili da ste
        unijeli krivi URL.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Povratak na početnu
      </Link>
    </div>
  );
}
