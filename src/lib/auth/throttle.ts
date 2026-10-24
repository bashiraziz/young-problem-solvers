/**
 * Best-effort failed-login throttle, keyed by client IP.
 * State is in memory per server instance: on serverless platforms it is NOT shared
 * across instances, so it slows brute force but is not a hard guarantee (docs/SECURITY.md).
 */

export interface ThrottleOptions {
  maxFailures?: number;
  windowMs?: number;
  now?: () => number;
}

export interface ThrottleStatus {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function createThrottle({ maxFailures = 5, windowMs = 15 * 60_000, now = Date.now }: ThrottleOptions = {}) {
  const failures = new Map<string, number[]>();
  const MAX_KEYS = 5_000;

  const recent = (key: string): number[] => {
    const cutoff = now() - windowMs;
    const list = (failures.get(key) ?? []).filter((t) => t > cutoff);
    if (list.length) failures.set(key, list);
    else failures.delete(key);
    return list;
  };

  return {
    check(key: string): ThrottleStatus {
      const list = recent(key);
      if (list.length < maxFailures) return { allowed: true, retryAfterSeconds: 0 };
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((list[0] + windowMs - now()) / 1000)) };
    },
    recordFailure(key: string): void {
      if (failures.size >= MAX_KEYS && !failures.has(key)) failures.delete(failures.keys().next().value as string);
      failures.set(key, [...recent(key), now()]);
    },
    reset(key: string): void {
      failures.delete(key);
    },
  };
}
