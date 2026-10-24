export const NAV_LINKS = [
  { href: "/", label: "Home", also: [] },
  { href: "/programme/foundation", label: "Foundation Programme", also: [] },
  { href: "/learn/foundation/unit-1", label: "Learning Library", also: ["/learn", "/practice"] },
  { href: "/challenge", label: "Try a Challenge", also: [] },
  { href: "/parents", label: "For Parents", also: [] },
  { href: "/about", label: "About", also: [] },
] as const;

type NavLink = (typeof NAV_LINKS)[number];

/** The link is current on its own path and on any page beneath it or its `also` sections (lessons, practice). */
export function isCurrent(pathname: string, link: NavLink): boolean {
  if (link.href === "/") return pathname === "/";
  return [link.href, ...link.also].some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
