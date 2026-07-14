import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight, Check } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth, passwordStrength } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Nera" },
      {
        name: "description",
        content:
          "Create your Nera account and start tracking finances through WhatsApp with AI.",
      },
      { property: "og:title", content: "Create account — Nera" },
      {
        property: "og:description",
        content:
          "Create your Nera account and start tracking finances through WhatsApp with AI.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { user, signUp, signInWithGoogle } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!email) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (strength.score < 2)
      e.password = "Use at least 8 characters with a mix of letters and numbers.";
    if (confirm !== password) e.confirm = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({ firstName, lastName, email, password });
      toast.success("Account created", {
        description: `Welcome to Nera, ${firstName}.`,
      });
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      const code = (err as Error & { code?: string }).code;
      const message = (err as Error).message ?? "Something went wrong.";
      if (code === "exists") setErrors({ email: message });
      else setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    setFormError(null);
    try {
      await signInWithGoogle();
      toast.success("Welcome to Nera", { description: "Signed in with Google" });
      navigate({ to: "/dashboard", replace: true });
    } catch {
      setFormError("We couldn't sign you in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const strengthColors = [
    "bg-muted",
    "bg-destructive",
    "bg-[color:oklch(0.75_0.14_80)]",
    "bg-[color:oklch(0.65_0.15_150)]",
    "bg-[color:oklch(0.62_0.15_150)]",
  ];

  return (
    <AuthLayout>
      <div className="space-y-1.5">
        <h2 className="text-[22px] font-semibold tracking-tight">
          Create your account
        </h2>
        <p className="text-[13px] text-muted-foreground">
          Start tracking finances through WhatsApp in under a minute.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
        {formError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-[12.5px]">
              {formError}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-[12.5px]">
              First name
            </Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={!!errors.firstName}
              className="h-10 rounded-lg"
            />
            {errors.firstName && (
              <p className="text-[12px] text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-[12.5px]">
              Last name
            </Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-invalid={!!errors.lastName}
              className="h-10 rounded-lg"
            />
            {errors.lastName && (
              <p className="text-[12px] text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

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
          <Label htmlFor="password" className="text-[12.5px]">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
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
          {password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < strength.score
                        ? strengthColors[strength.score]
                        : "bg-muted",
                    )}
                  />
                ))}
              </div>
              <p className="text-[11.5px] text-muted-foreground">
                Strength: <span className="text-foreground">{strength.label}</span>
              </p>
            </div>
          )}
          {errors.password && (
            <p className="text-[12px] text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="text-[12.5px]">
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={!!errors.confirm}
              className="h-10 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute inset-y-0 right-2 my-auto grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {confirm.length > 0 && confirm === password && !errors.confirm && (
            <p className="flex items-center gap-1 text-[11.5px] text-[color:var(--income)]">
              <Check className="h-3 w-3" /> Passwords match
            </p>
          )}
          {errors.confirm && (
            <p className="text-[12px] text-destructive">{errors.confirm}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || googleLoading}
          className="group h-10 w-full rounded-lg text-[13px] font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
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
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-foreground hover:text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}