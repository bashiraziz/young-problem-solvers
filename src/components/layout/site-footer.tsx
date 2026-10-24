import { Brand } from "./brand";
import { Container } from "@/components/ui/section";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper py-10">
      <Container className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <Brand />
        <p className="max-w-md text-sm text-muted">
          <strong className="block text-ink">Developed for curious young minds in Uganda.</strong>
          © 2026 YPS · Curriculum pilot and private preview · No registrations are being accepted.
        </p>
      </Container>
    </footer>
  );
}
