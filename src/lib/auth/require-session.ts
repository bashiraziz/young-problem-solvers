import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, getAuthConfig, verifySessionToken } from "./session";

/** Second layer behind proxy.ts: also makes the page dynamic so it is never served from a static cache. */
export async function requireSession(): Promise<void> {
  const cfg = getAuthConfig();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cfg || !(await verifySessionToken(cfg, token))) redirect("/login");
}
