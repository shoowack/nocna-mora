export const metadata = {
  title: "Privatnost | Noćna mora Željka Malnara"
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Politika privatnosti</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Prikupljanje podataka</h2>
          <p>
            Prikupljamo samo podatke potrebne za funkcioniranje stranice: email adresu i ime
            prilikom registracije. Ne dijelimo podatke s trećim stranama.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Kolačići</h2>
          <p>
            Koristimo kolačiće isključivo za autentifikaciju korisnika (sesija). Ne koristimo
            kolačiće za praćenje ili oglašavanje.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Videi</h2>
          <p>
            Videi su ugrađeni s vanjskih platformi (YouTube, Vimeo, itd.). Te platforme mogu
            koristiti vlastite kolačiće i pratiti aktivnost.
          </p>
        </section>

        {/* <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Kontakt
          </h2>
          <p>
            Za pitanja o privatnosti, kontaktirajte nas putem email adrese
            navedene u podnožju stranice.
          </p>
        </section> */}
      </div>
    </div>
  )
}
