import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

const searchSchema = z.object({
  redirect: z.string().optional(),
  expired: z.coerce.number().optional(),
});

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Nera" },
      {
        name: "description",
        content:
          "Sign in to Nera, your AI financial assistant for WhatsApp and beyond.",
      },
      { property: "og:title", content: "Sign in — Nera" },
      {
        property: "og:description",
        content:
          "Sign in to Nera, your AI financial assistant for WhatsApp and beyond.",
      },
    ],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, signIn, signInWithGoogle } = useAuth();
  const { redirect, expired } = Route.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  useEffect(() => {
    if (user) {
      navigate({ to: redirect ?? "/dashboard", replace: true });
    }
  }, [user, navigate, redirect]);

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back", {
        description: "Signing you in…",
      });
      navigate({ to: redirect ?? "/dashboard", replace: true });
    } catch (err) {
      const code = (err as Error & { code?: string }).code;
      const message = (err as Error).message ?? "Something went wrong.";
      if (code === "not_found") setErrors({ email: message });
      else if (code === "wrong_password") setErrors({ password: message });
      else setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google");
      navigate({ to: redirect ?? "/dashboard", replace: true });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-1.5">
        <h2 className="text-[22px] font-semibold tracking-tight">
          Welcome back
        </h2>
        <p className="text-[13px] text-muted-foreground">
          Sign in to continue managing your finances with Nera.
        </p>
      </div>

      {expired ? (
        <Alert className="mt-6 border-primary/30 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-[12.5px]">
            Your session expired. Please sign in again to continue.
          </AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
        {formError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-[12.5px]">
              {formError}
            </AlertDescription>
          </Alert>
        ) : null}

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
            aria-invalid={!!errors.email}
            className="h-10 rounded-lg"
          />
          {errors.email && (
            <p className="text-[12px] text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[12.5px]">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-[12px] font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              className="h-10 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-2 my-auto grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[12px] text-destructive">{errors.password}</p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-muted-foreground">
          <Checkbox
            checked={remember}
            onCheckedChange={(v) => setRemember(!!v)}
          />
          Remember me on this device
        </label>

        <Button
          type="submit"
          disabled={loading || googleLoading}
          className="group h-10 w-full rounded-lg text-[13px] font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>

        <div className="relative py-1.5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              or
            </span>
          </div>
        </div>

        <GoogleButton onClick={onGoogle} disabled={loading || googleLoading} />
      </form>

      <p className="mt-7 text-center text-[12.5px] text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-foreground hover:text-primary hover:underline"
        >
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}