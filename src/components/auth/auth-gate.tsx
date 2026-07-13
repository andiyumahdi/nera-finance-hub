import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { SessionLoading } from "./session-loading";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!initializing && !user) {
      navigate({
        to: "/login",
        search: { redirect: pathname, expired: 1 },
        replace: true,
      });
    }
  }, [initializing, user, navigate, pathname]);

  if (initializing) return <SessionLoading />;
  if (!user) return <SessionLoading message="Redirecting to sign in…" />;
  return <>{children}</>;
}