import Link from "next/link"

export default function KategorijaNotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center">
      <h1 className="mb-4 text-3xl font-bold text-foreground">Kategorija nije pronađena</h1>
      <p className="mx-auto mb-8 max-w-md text-muted-foreground">
        Nažalost, kategorija koju tražite nije dostupna. Moguće je da je uklonjena ili da je došlo
        do greške u vezi. Molimo vas da provjerite URL ili pretražite kategorije klikom na gumb
        ispod.
      </p>
      <Link
        href="/kategorije"
        className="inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Povratak na kategorije
      </Link>
    </div>
  )
}
