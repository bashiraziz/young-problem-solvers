import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, getAuthConfig, verifySessionToken } from "@/lib/auth/session";

const LOGIN_PATH = "/login";

function protectedResponse(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "private, no-store, max-age=0");
  return res;
}

/** Gate every route except the login page (and Next's hashed static bundles). Fails closed if unconfigured. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cfg = getAuthConfig();

  if (pathname === LOGIN_PATH) return protectedResponse(NextResponse.next());

  if (cfg && (await verifySessionToken(cfg, request.cookies.get(SESSION_COOKIE)?.value))) {
    return protectedResponse(NextResponse.next());
  }

  // Misconfigured or unauthenticated. Non-navigation requests get a plain 401, never the page.
  const isNavigation = request.method === "GET" && request.headers.get("accept")?.includes("text/html");
  if (!isNavigation) return protectedResponse(new NextResponse("Unauthorized", { status: 401 }));
  return protectedResponse(NextResponse.redirect(new URL(LOGIN_PATH, request.url)));
}

export const config = {
  matcher: ["/((?!_next/static).*)"],
};
