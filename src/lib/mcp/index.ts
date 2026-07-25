import { defineMcp } from "@lovable.dev/mcp-js";
import getDemoTransactions from "./tools/get-demo-transactions";
import summarizeSpending from "./tools/summarize-spending";
import goalProjection from "./tools/goal-projection";

export default defineMcp({
  name: "nera-mcp",
  title: "Nera Finance MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Nera personal finance demo app. Use `get_demo_transactions` to explore sample data, `summarize_spending` to compute income/expense/category totals from a list of transactions, and `goal_projection` to estimate how long a savings goal will take.",
  tools: [getDemoTransactions, summarizeSpending, goalProjection],
});