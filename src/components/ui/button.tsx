import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "sun";

const base =
  "inline-flex items-center justify-center gap-3 rounded-xl border px-5 py-4 text-sm font-extrabold transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary: "border-transparent bg-teal text-white hover:bg-teal-dark",
  outline: "border-line bg-white text-ink hover:bg-mint",
  sun: "border-transparent bg-sun text-ink hover:brightness-105",
};

interface ButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: Variant;
}

/** Link styled as a button: client-side navigation for internal paths, a plain anchor otherwise. Use a native <button> for actions. */
export function Button({ variant = "primary", className = "", href, ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  return href.startsWith("/") ? <Link href={href} className={classes} {...props} /> : <a href={href} className={classes} {...props} />;
}
