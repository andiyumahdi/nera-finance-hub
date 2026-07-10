export function formatCurrency(n: number, opts: { compact?: boolean; signed?: boolean } = {}) {
  const abs = Math.abs(n);
  const s = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts.compact ? "compact" : "standard",
    maximumFractionDigits: abs >= 1000 && opts.compact ? 1 : 2,
  }).format(abs);
  if (opts.signed) return `${n < 0 ? "-" : "+"}${s}`;
  return n < 0 ? `-${s}` : s;
}

export function formatPercent(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function formatDelta(n: number) {
  const sign = n > 0 ? "+" : n < 0 ? "" : "";
  return `${sign}${n.toFixed(1)}%`;
}
