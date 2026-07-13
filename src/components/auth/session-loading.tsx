import { Sparkles, Loader2 } from "lucide-react";

export function SessionLoading({
  message = "Checking your session…",
}: {
  message?: string;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative">
          <span
            aria-hidden
            className="absolute inset-0 -m-3 rounded-2xl bg-primary/25 blur-xl animate-pulse"
          />
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {message}
        </div>
      </div>
    </div>
  );
}