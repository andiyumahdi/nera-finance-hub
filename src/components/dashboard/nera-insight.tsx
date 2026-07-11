import { Sparkles, TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const insights = [
  {
    icon: TrendingUp,
    tone: "expense" as const,
    title: "Food spending is trending up",
    body: "You spent 18% more on Dining this week compared to last week.",
  },
  {
    icon: TrendingDown,
    tone: "income" as const,
    title: "You saved $340 this week",
    body: "Transport and Subscriptions were both lower than your 4‑week average.",
  },
  {
    icon: CalendarDays,
    tone: "muted" as const,
    title: "Weekends drive most of your spending",
    body: "62% of your discretionary charges land on Saturday or Sunday.",
  },
];

export function NeraInsight() {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5">
        <div className="flex items-center gap-2">
          <div className="grid h-5 w-5 place-items-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="h-3 w-3" />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
            Nera Insight
          </span>
          <span className="ml-auto text-[11px] text-muted-foreground">Updated just now</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:divide-x md:divide-border">
          {insights.map((it, i) => {
            const Icon = it.icon;
            const toneClass =
              it.tone === "income"
                ? "text-income"
                : it.tone === "expense"
                  ? "text-expense"
                  : "text-muted-foreground";
            return (
              <div key={i} className="min-w-0 md:px-5 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 ${toneClass}`} strokeWidth={1.75} />
                  <p className="truncate text-sm font-medium">{it.title}</p>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                  {it.body}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}