import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
// Vercel's preview toolbar (comments) needs a few vercel.live hosts. Production builds do not allow them.
const isVercelPreview = process.env.VERCEL_ENV === "preview";
const toolbar = (hosts: string) => (isVercelPreview ? ` ${hosts}` : "");

/**
 * Content-Security-Policy. The site loads nothing from third parties, so everything is 'self'.
 * 'unsafe-inline' is required for Next.js's inline bootstrap scripts and style tags on statically
 * prerendered pages (a nonce would force every page to render per request). `connect-src 'self'` and
 * `form-action 'self'` mean a script on the page cannot send anything to another origin — which also
 * backs up the promise that the challenge never transmits what a child types.
 * Not applied in development, where Next.js needs eval and a websocket for hot reload.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${toolbar("https://vercel.live")}`,
  `style-src 'self' 'unsafe-inline'${toolbar("https://vercel.live")}`,
  `img-src 'self' data:${toolbar("https://vercel.live https://vercel.com data: blob:")}`,
  `font-src 'self'${toolbar("https://vercel.live https://assets.vercel.com")}`,
  `connect-src 'self'${toolbar("https://vercel.live wss://ws-us3.pusher.com")}`,
  `frame-src 'self'${toolbar("https://vercel.live")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  ...(isProduction ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
