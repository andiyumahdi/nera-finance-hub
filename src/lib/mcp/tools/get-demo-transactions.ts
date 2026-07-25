import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

type Txn = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: "income" | "expense";
};

const DEMO_TRANSACTIONS: Txn[] = [
  { id: "t_1001", date: "2026-07-22", merchant: "Whole Foods", category: "Groceries", amount: -84.31, type: "expense" },
  { id: "t_1002", date: "2026-07-21", merchant: "Acme Payroll", category: "Salary", amount: 4200.0, type: "income" },
  { id: "t_1003", date: "2026-07-20", merchant: "Uber", category: "Transport", amount: -18.4, type: "expense" },
  { id: "t_1004", date: "2026-07-19", merchant: "Netflix", category: "Subscriptions", amount: -15.99, type: "expense" },
  { id: "t_1005", date: "2026-07-18", merchant: "Blue Bottle Coffee", category: "Dining", amount: -6.25, type: "expense" },
  { id: "t_1006", date: "2026-07-17", merchant: "Apple", category: "Shopping", amount: -129.0, type: "expense" },
  { id: "t_1007", date: "2026-07-16", merchant: "Freelance Invoice", category: "Side Income", amount: 850.0, type: "income" },
  { id: "t_1008", date: "2026-07-15", merchant: "Shell", category: "Transport", amount: -46.12, type: "expense" },
];

export default defineTool({
  name: "get_demo_transactions",
  title: "Get demo transactions",
  description:
    "Return sample Nera transactions (demo data, not tied to any user account). Useful for exploring the shape of the data.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Maximum number of transactions to return (default 8)."),
    type: z
      .enum(["income", "expense"])
      .optional()
      .describe("Filter by transaction type."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ limit, type }) => {
    const filtered = type ? DEMO_TRANSACTIONS.filter((t) => t.type === type) : DEMO_TRANSACTIONS;
    const sliced = filtered.slice(0, limit ?? 8);
    return {
      content: [{ type: "text", text: JSON.stringify(sliced, null, 2) }],
      structuredContent: { transactions: sliced },
    };
  },
});