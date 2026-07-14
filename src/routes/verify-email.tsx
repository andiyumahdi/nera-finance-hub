import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — Nera" },
      {
        name: "description",
        content: "Confirm your email to finish setting up your Nera account.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
          <MailCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-[22px] font-semibold tracking-tight">
            Verify your email
          </h2>
          <p className="text-[13px] text-muted-foreground">
            We've sent a verification link to your inbox. Click it to activate
            your Nera account. The link expires in 24 hours.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg text-[13px]"
            disabled
          >
            Resend verification email
          </Button>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}