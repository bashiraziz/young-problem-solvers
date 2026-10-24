"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./nav-links";

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
      {NAV_LINKS.map((l) => {
        const current = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={current ? "page" : undefined}
            className={`border-b-2 py-2 text-[13px] font-bold ${current ? "border-teal text-teal" : "border-transparent text-ink/75 hover:text-teal"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
