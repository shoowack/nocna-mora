import { Container } from "@/components/container";

export const Footer = () => {
  return (
    <Container className="flex-none border-t border-stone-200 md:py-5">
      <footer className="text-balance text-center text-xs text-stone-400">
        Svi zaštitni znakovi, uslužni znakovi, trgovački nazivi, vizualni
        identiteti, nazivi proizvoda i logotipi koji se pojavljuju vlasništvo su
        njihovih odgovarajućih vlasnika.
      </footer>
    </Container>
  );
};
