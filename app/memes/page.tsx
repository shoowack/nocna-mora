import { Container } from "@/components/container";
import { MemeGenerator } from "@/components/meme-generator";

export default async function MemesPage({ params }) {
  return (
    <Container>
      <MemeGenerator />
    </Container>
  );
}
