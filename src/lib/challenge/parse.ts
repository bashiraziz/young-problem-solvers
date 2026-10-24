export type ParseError = "empty" | "negative" | "decimal" | "not-a-number" | "too-large";

export type ParseResult = { ok: true; value: number } | { ok: false; reason: ParseError };

export const MAX_UGX_INPUT = 10_000_000;

/**
 * Parses a whole number typed by a child. Accepts digits with optional thousands separators
 * (commas or spaces), e.g. "48000", "48,000" or "48 000". Rejects everything else.
 */
export function parseWholeNumber(raw: string, max: number = MAX_UGX_INPUT): ParseResult {
  const text = raw.trim();
  if (text === "") return { ok: false, reason: "empty" };
  if (/^[-−–]/.test(text)) return { ok: false, reason: "negative" };
  if (/^\d[\d,\s]*[.]\d*$/.test(text) || /^[.]\d+$/.test(text)) return { ok: false, reason: "decimal" };

  const digits = text.replace(/[,\s]/g, "");
  if (!/^\d+$/.test(digits)) return { ok: false, reason: "not-a-number" };
  if (digits.length > 12) return { ok: false, reason: "too-large" };

  const value = Number(digits);
  if (value > max) return { ok: false, reason: "too-large" };
  return { ok: true, value };
}

export function explainParseError(reason: ParseError, max: number = MAX_UGX_INPUT): string {
  switch (reason) {
    case "empty":
      return "Type a number first.";
    case "negative":
      return "Use a number that is zero or more. Money you spend is counted as a positive amount.";
    case "decimal":
      return "Use a whole number of shillings, with no decimal point.";
    case "not-a-number":
      return "Use digits only, for example 48000 or 48,000.";
    case "too-large":
      return `That number is too big for this activity. Try a number up to ${max.toLocaleString("en-US")}.`;
  }
}
