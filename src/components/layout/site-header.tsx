import Link from "next/link";
import { Brand } from "./brand";
import { MobileMenu } from "./mobile-menu";
import { SiteNav } from "./site-nav";
import { Container } from "@/components/ui/section";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="Young Problem Solvers — home">
          <Brand compact />
        </Link>
        <SiteNav />
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-[#ebeee5] px-3 py-2 text-[11px] font-extrabold tracking-widest text-muted uppercase sm:inline">
            Private preview
          </span>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
