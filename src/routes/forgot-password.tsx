import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  MailCheck,
  ArrowRight,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Nera" },
      {
        name: "description",
        content: "Reset your Nera password by email.",
      },
      { property: "og:title", content: "Reset password — Nera" },
      {
        property: "og:description",
        content: "Reset your Nera password by email.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { sendReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await sendReset(email);
      setSent(true);
    } catch {
      setError("We couldn't send the reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {sent ? (
        <div className="space-y-6">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <MailCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[22px] font-semibold tracking-tight">
              Check your email
            </h2>
            <p className="text-[13px] text-muted-foreground">
              We&apos;ve sent a password reset link to{" "}
              <span className="text-foreground">{email}</span>. The link expires
              in 30 minutes.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg text-[13px]"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Send to another address
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
      ) : (
        <>
          <div className="space-y-1.5">
            <h2 className="text-[22px] font-semibold tracking-tight">
              Reset your password
            </h2>
            <p className="text-[13px] text-muted-foreground">
              Enter the email linked to your account and we&apos;ll send you a
              reset link.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-[12.5px]">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[12.5px]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@nera.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group h-10 w-full rounded-lg text-[13px] font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link…
                </>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-7 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
}