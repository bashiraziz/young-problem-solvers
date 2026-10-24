import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] max-w-xl flex-col items-start justify-center gap-5 py-16">
      <p className="text-sm font-bold tracking-widest text-teal uppercase">404</p>
      <h1 className="text-4xl font-black tracking-tight">That page isn&apos;t part of the plan.</h1>
      <p className="text-muted">The page you are looking for does not exist in this preview.</p>
      <Button href="/">Back to the homepage</Button>
    </Container>
  );
}
