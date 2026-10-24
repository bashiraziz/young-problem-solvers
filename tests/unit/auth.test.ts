import { describe, expect, it } from "vitest";
import {
  SESSION_MAX_AGE_S,
  createSessionToken,
  getAuthConfig,
  passwordMatches,
  safeEqual,
  verifySessionToken,
} from "@/lib/auth/session";
import { createThrottle } from "@/lib/auth/throttle";

const cfg = { password: "correct-horse-battery", secret: "s".repeat(40) };

describe("getAuthConfig", () => {
  it("fails closed when values are missing or too short", () => {
    expect(getAuthConfig({})).toBeNull();
    expect(getAuthConfig({ YPS_SITE_PASSWORD: "short", YPS_SESSION_SECRET: "s".repeat(40) })).toBeNull();
    expect(getAuthConfig({ YPS_SITE_PASSWORD: "p".repeat(14), YPS_SESSION_SECRET: "short" })).toBeNull();
  });
  it("accepts adequate values", () => {
    expect(getAuthConfig({ YPS_SITE_PASSWORD: "p".repeat(14), YPS_SESSION_SECRET: "s".repeat(32) })).not.toBeNull();
  });
});

describe("passwordMatches", () => {
  it("accepts only the exact password", async () => {
    expect(await passwordMatches(cfg, cfg.password)).toBe(true);
    expect(await passwordMatches(cfg, cfg.password + "x")).toBe(false);
    expect(await passwordMatches(cfg, "")).toBe(false);
    expect(await passwordMatches(cfg, "a".repeat(513))).toBe(false);
  });
});

describe("session tokens", () => {
  it("verifies a fresh token", async () => {
    expect(await verifySessionToken(cfg, await createSessionToken(cfg))).toBe(true);
  });
  it("rejects missing, malformed and tampered tokens", async () => {
    const t = await createSessionToken(cfg);
    expect(await verifySessionToken(cfg, undefined)).toBe(false);
    expect(await verifySessionToken(cfg, "garbage")).toBe(false);
    const parts = t.split(".");
    const forgedExp = `${Number(parts[0]) + 1000}.${parts[1]}.${parts[2]}`;
    expect(await verifySessionToken(cfg, forgedExp)).toBe(false);
    expect(await verifySessionToken(cfg, t.slice(0, -1) + (t.endsWith("0") ? "1" : "0"))).toBe(false);
  });
  it("expires after the max age", async () => {
    const now = 1_800_000_000_000;
    const t = await createSessionToken(cfg, now);
    expect(await verifySessionToken(cfg, t, now + SESSION_MAX_AGE_S * 1000 - 1)).toBe(true);
    expect(await verifySessionToken(cfg, t, now + SESSION_MAX_AGE_S * 1000 + 1)).toBe(false);
  });
  it("is invalidated by changing the secret or the password", async () => {
    const t = await createSessionToken(cfg);
    expect(await verifySessionToken({ ...cfg, secret: "z".repeat(40) }, t)).toBe(false);
    expect(await verifySessionToken({ ...cfg, password: "another-long-password" }, t)).toBe(false);
  });
  it("rejects tokens whose expiry is implausibly far in the future", async () => {
    const t = await createSessionToken(cfg, Date.now() + SESSION_MAX_AGE_S * 5000);
    expect(await verifySessionToken(cfg, t)).toBe(false);
  });
});

describe("safeEqual", () => {
  it("compares strings including different lengths", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
});

describe("throttle", () => {
  it("locks after max failures and unlocks after the window", () => {
    let t = 0;
    const th = createThrottle({ maxFailures: 3, windowMs: 1000, now: () => t });
    for (let i = 0; i < 3; i++) {
      expect(th.check("ip").allowed).toBe(true);
      th.recordFailure("ip");
    }
    const locked = th.check("ip");
    expect(locked.allowed).toBe(false);
    expect(locked.retryAfterSeconds).toBeGreaterThan(0);
    expect(th.check("other").allowed).toBe(true);
    t = 1001;
    expect(th.check("ip").allowed).toBe(true);
  });
  it("reset clears failures", () => {
    const th = createThrottle({ maxFailures: 1 });
    th.recordFailure("ip");
    expect(th.check("ip").allowed).toBe(false);
    th.reset("ip");
    expect(th.check("ip").allowed).toBe(true);
  });
});
