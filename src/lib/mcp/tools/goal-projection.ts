import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "goal_projection",
  title: "Project savings goal",
  description:
    "Compute how many months are needed to reach a savings goal given a starting balance and monthly contribution, plus a simple month-by-month projection.",
  inputSchema: {
    target: z.number().positive().describe("Target amount to reach."),
    current: z.number().min(0).describe("Current saved amount."),
    monthlyContribution: z.number().positive().describe("Amount saved per month."),
    annualInterestRate: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe("Optional annual interest rate as a decimal (e.g. 0.04 = 4%)."),
    maxMonths: z.number().int().min(1).max(600).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ target, current, monthlyContribution, annualInterestRate = 0, maxMonths = 120 }) => {
    const monthlyRate = annualInterestRate / 12;
    let balance = current;
    const schedule: { month: number; balance: number }[] = [];
    let months = 0;
    while (balance < target && months < maxMonths) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      months += 1;
      schedule.push({ month: months, balance: Number(balance.toFixed(2)) });
    }
    const reached = balance >= target;
    const result = {
      reached,
      months: reached ? months : null,
      finalBalance: Number(balance.toFixed(2)),
      target,
      schedule,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});