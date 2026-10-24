import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Young Problem Solvers | Think. Build. Explain.", template: "%s | Young Problem Solvers" },
  description:
    "Young Problem Solvers is a proposed mathematics-led enrichment programme for curious learners aged 9–12 in Uganda. Private development preview.",
  robots: { index: false, follow: false, noarchive: true },
};

export const viewport: Viewport = { themeColor: "#faf8f2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
