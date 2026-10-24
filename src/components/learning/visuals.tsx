import type { ReactNode } from "react";
import { PLACES, roundTo } from "@/lib/learning/items";

const fmt = (n: number) => n.toLocaleString("en-US");

/** Digits of `n` aligned to the five place-value columns (blank where the number is shorter). */
const digitsOf = (n: number) => String(n).padStart(5, " ").split("").map((c) => c.trim());

const th = "border border-line bg-cream px-3 py-2";

/** Accessible place-value table comparing amounts, as in the worked example of lesson 1. */
export function PlaceValueTable({ numbers }: { numbers: readonly number[] }) {
  return (
    <div role="region" aria-label="Place-value table (scrolls sideways on small screens)" tabIndex={0} className="overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-center text-sm">
        <caption className="pb-2 text-left font-bold">Place-value table</caption>
        <thead>
          <tr>
            <th scope="col" className={`${th} text-left`}>Amount (UGX)</th>
            {PLACES.map((p) => (
              <th key={p} scope="col" className={th}>{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {numbers.map((n) => (
            <tr key={n}>
              <th scope="row" className="border border-line px-3 py-2 text-left">{fmt(n)}</th>
              {digitsOf(n).map((d, i) => (
                <td key={i} className="border border-line px-3 py-2 text-lg font-black">{d}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Rounded amounts, estimate and exact sum side by side, as in the worked example of lesson 2. */
export function EstimateTable({ terms, nearest }: { terms: readonly [number, number]; nearest: number }) {
  const rounded = terms.map((t) => roundTo(t, nearest));
  const row = (label: string, a: number, b: number): ReactNode => (
    <tr>
      <th scope="row" className="border border-line px-3 py-2 text-left">{label}</th>
      <td className="border border-line px-3 py-2">{fmt(a)}</td>
      <td className="border border-line px-3 py-2">{fmt(b)}</td>
      <td className="border border-line px-3 py-2 font-black">{fmt(a + b)}</td>
    </tr>
  );
  return (
    <div role="region" aria-label="Estimate and exact sum table (scrolls sideways on small screens)" tabIndex={0} className="overflow-x-auto">
      <table className="w-full min-w-[26rem] border-collapse text-center text-sm">
        <caption className="pb-2 text-left font-bold">Estimate to the nearest {fmt(nearest)}, then calculate exactly</caption>
        <thead>
          <tr>
            <th scope="col" className={`${th} text-left`}>Method</th>
            <th scope="col" className={th}>First amount</th>
            <th scope="col" className={th}>Second amount</th>
            <th scope="col" className={th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {row(`Estimate (nearest ${fmt(nearest)})`, rounded[0], rounded[1])}
          {row("Exact", terms[0], terms[1])}
        </tbody>
      </table>
    </div>
  );
}
