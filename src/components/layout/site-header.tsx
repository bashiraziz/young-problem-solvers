import { Brand } from "./brand";
import { MobileMenu } from "./mobile-menu";
import { Container } from "@/components/ui/section";

export const NAV_LINKS = [
  { href: "#approach", label: "Our approach" },
  { href: "#curriculum", label: "The programme" },
  { href: "#challenge", label: "Try a challenge" },
  { href: "#parents", label: "For parents" },
  { href: "#faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <a href="#top" aria-label="Young Problem Solvers — back to top">
          <Brand />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] font-bold text-ink/75 hover:text-teal">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-[#ebeee5] px-3 py-2 text-[11px] font-extrabold tracking-widest text-muted uppercase sm:inline">
            Private preview
          </span>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </Container>
    </header>
  );
}
