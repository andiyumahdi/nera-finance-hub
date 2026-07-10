import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { spendingByCategory } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-3)",
  "oklch(0.65 0.10 300)",
  "oklch(0.70 0.10 190)",
  "oklch(0.60 0.08 30)",
];

export function CategoryDonut() {
  const total = spendingByCategory.reduce((a, b) => a + b.amount, 0);
  return (
    <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
      <div className="relative h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spendingByCategory}
              dataKey="amount"
              nameKey="category"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {spendingByCategory.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--popover-foreground)",
              }}
              formatter={(v) => formatCurrency(Number(v))}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-[11px] text-muted-foreground">Total</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatCurrency(total, { compact: true })}
            </div>
          </div>
        </div>
      </div>
      <ul className="space-y-2">
        {spendingByCategory.map((c, i) => {
          const pct = (c.amount / total) * 100;
          return (
            <li key={c.category} className="flex items-center gap-3 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="min-w-0 flex-1 truncate">{c.category}</span>
              <span className="tabular-nums text-muted-foreground">{pct.toFixed(1)}%</span>
              <span className="w-20 text-right font-mono text-xs tabular-nums">
                {formatCurrency(c.amount)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
