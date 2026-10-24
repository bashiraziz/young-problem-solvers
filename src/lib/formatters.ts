/** Whole-shilling UGX formatting, e.g. "UGX 8,000" or "−UGX 1,000". */
export function formatUgx(n: number): string {
  const sign = n < 0 ? "−" : "";
  return `${sign}UGX ${Math.abs(n).toLocaleString("en-US")}`;
}

/** Plain thousands-separated number, e.g. "25,000". */
export function formatNumber(n: number): string {
  return (n < 0 ? "−" : "") + Math.abs(n).toLocaleString("en-US");
}
