import type { Metadata } from "next";
import { Brand } from "@/components/layout/brand";
import { loginAction } from "@/lib/auth/actions";
import { getAuthConfig } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Private preview | Young Problem Solvers" };

const MESSAGES: Record<string, string> = {
  invalid: "That password was not recognised. Please try again.",
  locked: "Too many attempts. Please wait a few minutes and try again.",
  config:
    "Site protection is not configured. The site owner must set YPS_SITE_PASSWORD (14+ characters) and YPS_SESSION_SECRET (32+ characters).",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const configured = getAuthConfig() !== null;
  const message = !configured ? MESSAGES.config : e ? MESSAGES[e] : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Brand />
        <div className="mt-8 rounded-3xl border border-line bg-white p-8 shadow-card">
          <p className="text-xs font-extrabold tracking-[0.14em] text-teal uppercase">Private preview</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Big ideas are taking shape.</h1>
          <p className="mt-3 text-muted">
            Young Problem Solvers is an original learning programme in development. Enter the preview password to
            continue.
          </p>
          {message && (
            <p role="alert" className="mt-5 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-semibold text-danger">
              {message}
            </p>
          )}
          {configured && (
            <form action={loginAction} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-extrabold">Preview password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-ink/30 bg-white px-4 py-3"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-teal px-5 py-4 text-sm font-extrabold text-white hover:bg-teal-dark"
              >
                Enter the preview →
              </button>
            </form>
          )}
        </div>
        <p className="mt-5 text-center text-xs text-muted">Invite-only development preview. Not a public admissions site.</p>
      </div>
    </main>
  );
}
