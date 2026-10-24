export interface Product {
  id: string;
  name: string;
  unit: string;
  /** UGX paid to the supplier per unit. */
  buy: number;
  /** UGX charged to customers per unit. */
  sell: number;
}

export interface OrderLine {
  productId: string;
  quantity: number;
}

export interface Scenario {
  /** Stable ID, e.g. "yps.challenge.refreshments-stall". */
  id: string;
  version: string;
  title: string;
  ageRange: string;
  duration: string;
  /** Curriculum week IDs this activity practises (see content/programme.ts). */
  weekIds: readonly string[];
  budget: number;
  /** Fixed cost paid for the stall, regardless of what is sold. */
  stallFee: number;
  /** A reserve counts as at least this much money left over. */
  reserveTarget: number;
  maxPerProduct: number;
  /** "What if only 3 out of every 4 items sell?" */
  soldFraction: { numerator: number; denominator: number };
  products: readonly Product[];
  estimateOrder: readonly OrderLine[];
  /** Estimates within this fraction of the exact total are reasonable. */
  estimateTolerance: number;
}
