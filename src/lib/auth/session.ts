/**
 * Shared-password preview gate: signed, expiring session tokens.
 * Uses Web Crypto only, so it runs in both the proxy and server actions.
 * See docs/SECURITY.md for the threat model.
 */

export const SESSION_COOKIE = "yps_session";
export const SESSION_MAX_AGE_S = 60 * 60 * 12;

export const MIN_PASSWORD_LENGTH = 14;
export const MIN_SECRET_LENGTH = 32;

export interface AuthConfig {
  password: string;
  secret: string;
}

/** Returns null when protection is not (properly) configured — callers must fail closed. */
export function getAuthConfig(env: Record<string, string | undefined> = process.env): AuthConfig | null {
  const password = env.YPS_SITE_PASSWORD ?? "";
  const secret = env.YPS_SESSION_SECRET ?? "";
  if (password.length < MIN_PASSWORD_LENGTH || secret.length < MIN_SECRET_LENGTH) return null;
  return { password, secret };
}

const encoder = new TextEncoder();

function toHex(buf: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time comparison for equal-purpose hex strings. */
export function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function hmacHex(key: string, message: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", k, encoder.encode(message)));
}

/** Changing either the password or the secret invalidates every existing session. */
const signingKey = (cfg: AuthConfig) => `${cfg.secret}\u0000${cfg.password}`;

export async function passwordMatches(cfg: AuthConfig, supplied: string): Promise<boolean> {
  if (supplied.length === 0 || supplied.length > 512) return false;
  const [a, b] = await Promise.all([sha256Hex(supplied), sha256Hex(cfg.password)]);
  return safeEqual(a, b);
}

export async function createSessionToken(cfg: AuthConfig, now = Date.now()): Promise<string> {
  const exp = now + SESSION_MAX_AGE_S * 1000;
  const nonce = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const payload = `${exp}.${nonce}`;
  return `${payload}.${await hmacHex(signingKey(cfg), `yps-session-v1:${payload}`)}`;
}

export async function verifySessionToken(cfg: AuthConfig, token: string | undefined, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const m = /^(\d{13})\.([0-9a-f]{32})\.([0-9a-f]{64})$/.exec(token);
  if (!m) return false;
  const exp = Number(m[1]);
  if (exp <= now || exp > now + SESSION_MAX_AGE_S * 1000) return false;
  const expected = await hmacHex(signingKey(cfg), `yps-session-v1:${m[1]}.${m[2]}`);
  return safeEqual(expected, m[3]);
}
