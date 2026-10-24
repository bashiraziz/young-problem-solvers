// Usage: node scripts/verify-protection.mjs https://your-project.vercel.app [more URLs...]
// Confirms, from outside, that deployments are behind Vercel Authentication (redirect to vercel.com/sso-api).
// Vercel Authentication is the ONLY access control for this site: run this after any Vercel settings change.
const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("Provide at least one deployment URL.");
  process.exit(2);
}

let failed = false;
for (const base of urls) {
  for (const path of ["/", "/robots.txt", "/favicon.ico"]) {
    const res = await fetch(new URL(path, base), { redirect: "manual", headers: { accept: "text/html" } });
    const location = res.headers.get("location") ?? "";
    const ok = (res.status === 302 || res.status === 307) && location.startsWith("https://vercel.com/sso-api");
    console.log(`${ok ? "PROTECTED  " : "EXPOSED?   "} ${res.status} ${new URL(path, base).href}`);
    if (!ok) failed = true;
  }
}
process.exit(failed ? 1 : 0);
