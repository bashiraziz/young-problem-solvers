import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Young Problem Solvers | Think. Build. Explain.",
  description:
    "Young Problem Solvers is a proposed mathematics-led enrichment programme for curious learners aged 9–12 in Uganda. Private development preview.",
  robots: { index: false, follow: false, noarchive: true },
};

export const viewport: Viewport = { themeColor: "#faf8f2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
