"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, isCurrent } from "./nav-links";

export function MobileMenu() {
  const pathname = usePathname();
  // The menu is open only on the page where it was opened, so it closes itself after navigating.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenedOn(null);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpenedOn(open ? null : pathname)}
        className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-extrabold"
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-line bg-cream px-4 py-3 shadow-card"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isCurrent(pathname, l) ? "page" : undefined}
                  onClick={() => setOpenedOn(null)}
                  className={`block rounded-lg px-3 py-3 text-base font-bold hover:bg-mint ${isCurrent(pathname, l) ? "text-teal" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
