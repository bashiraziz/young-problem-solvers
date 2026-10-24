"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  createSessionToken,
  getAuthConfig,
  passwordMatches,
} from "./session";
import { createThrottle } from "./throttle";

const throttle = createThrottle();

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function loginAction(formData: FormData): Promise<void> {
  const cfg = getAuthConfig();
  if (!cfg) redirect("/login?e=config");

  const key = await clientKey();
  if (!throttle.check(key).allowed) redirect("/login?e=locked");

  const supplied = formData.get("password");
  if (typeof supplied === "string" && (await passwordMatches(cfg, supplied))) {
    throttle.reset(key);
    (await cookies()).set(SESSION_COOKIE, await createSessionToken(cfg), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_S,
    });
    redirect("/");
  }

  throttle.recordFailure(key);
  await new Promise((r) => setTimeout(r, 600)); // small fixed delay on every failure
  redirect("/login?e=invalid");
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
