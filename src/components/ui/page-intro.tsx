import type { ReactNode } from "react";
import { Container, Eyebrow } from "./section";

/** Top of every inner page: eyebrow, the page's single h1, and an intro paragraph. */
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="bg-[radial-gradient(ellipse_at_85%_20%,#e2f3e6_0,transparent_55%)] pt-14 pb-10 sm:pt-20 sm:pb-12">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.08] font-black tracking-tight text-balance sm:text-5xl">{title}</h1>
        {children && <div className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{children}</div>}
      </Container>
    </section>
  );
}
