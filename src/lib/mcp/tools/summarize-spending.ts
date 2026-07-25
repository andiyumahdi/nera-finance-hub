import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const TxnSchema = z.object({
  amount: z.number().describe("Positive for income, negative for expense."),
  category: z.string().optional(),
});

export default defineTool({
  name: "summarize_spending",
  title: "Summarize spending",
  description:
    "Given a list of transactions (positive = income, negative = expense), return totals and per-category expense breakdown.",
  inputSchema: {
    transactions: z.array(TxnSchema).min(1).max(500),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ transactions }) => {
    let income = 0;
    let expense = 0;
    const byCategory: Record<string, number> = {};
    for (const t of transactions) {
      if (t.amount >= 0) income += t.amount;
      else {
        const spent = -t.amount;
        expense += spent;
        const cat = t.category ?? "Uncategorized";
        byCategory[cat] = (byCategory[cat] ?? 0) + spent;
      }
    }
    const net = income - expense;
    const result = {
      income: Number(income.toFixed(2)),
      expense: Number(expense.toFixed(2)),
      net: Number(net.toFixed(2)),
      byCategory: Object.fromEntries(
        Object.entries(byCategory)
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => [k, Number(v.toFixed(2))]),
      ),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});