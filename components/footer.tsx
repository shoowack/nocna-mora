import { Container } from "./container";

export const Footer = () => {
  return (
    <Container className="md:py-5 border-t border-stone-200 flex-none">
      <footer className="text-neutral-400 text-center text-xs text-balance">
        Svi zaštitni znakovi, uslužni znakovi, trgovački nazivi, vizualni
        identiteti, nazivi proizvoda i logotipi koji se pojavljuju vlasništvo su
        njihovih odgovarajućih vlasnika.
      </footer>
    </Container>
  );
};
