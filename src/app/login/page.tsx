import type { Metadata } from "next";
import { loginAction } from "@/lib/auth/actions";
import { getAuthConfig } from "@/lib/auth/session";

// Deliberately minimal: this page is reachable by anyone with the URL, so it reveals nothing about the project.
export const metadata: Metadata = { title: "Private preview" };

const MESSAGES: Record<string, string> = {
  invalid: "Incorrect password.",
  locked: "Too many attempts. Try again later.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const configured = getAuthConfig() !== null;
  if (!configured) {
    // Detail goes to server logs only; the public page stays generic.
    console.error("YPS_SITE_PASSWORD (14+ chars) and YPS_SESSION_SECRET (32+ chars) must be set; site is locked.");
  }
  const message = !configured ? "Unavailable." : e ? MESSAGES[e] : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-card">
        <h1 className="text-2xl font-black tracking-tight">Private preview</h1>
        {message && (
          <p role="alert" className="mt-4 text-sm font-semibold text-danger">
            {message}
          </p>
        )}
        {configured && (
          <form action={loginAction} className="mt-5 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-extrabold">Password</label>
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
            <button type="submit" className="w-full rounded-xl bg-teal px-5 py-3.5 text-sm font-extrabold text-white hover:bg-teal-dark">
              Continue
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
