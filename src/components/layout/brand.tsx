import Image from "next/image";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], weight: "900", display: "swap" });

/** `compact` hides the tagline on small screens so the header never crowds out the menu button. */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      {/* Decorative: the name sits right next to it. */}
      <Image src="/brand/mark.svg" alt="" width={44} height={44} className="size-11 shrink-0 -rotate-3" />
      <span>
        <span className={`${nunito.className} block text-[15px] leading-tight tracking-tight`}>Young Problem Solvers</span>
        <span className={`mt-1 text-[11px] font-bold tracking-wide text-muted uppercase ${compact ? "hidden sm:block" : "block"}`}>
          Think. Build. Explain.
        </span>
      </span>
    </span>
  );
}
