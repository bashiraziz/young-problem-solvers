import Link from "next/link";
import { Brand } from "./brand";
import { NAV_LINKS } from "./nav-links";
import { Container } from "@/components/ui/section";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper py-10">
      <Container className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <Brand />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="inline-block py-1.5 hover:text-teal">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted md:text-right">
          <strong className="block text-ink">Developed for curious young minds in Uganda.</strong>
          © 2026 YPS · Curriculum pilot and private preview · No registrations are being accepted.
        </p>
      </Container>
    </footer>
  );
}
