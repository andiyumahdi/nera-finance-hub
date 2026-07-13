import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  firstName: string;
  lastName: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  sendReset: (email: string) => Promise<void>;
};

const STORAGE_KEY = "nera-auth-user";
const USERS_KEY = "nera-auth-users";

const AuthContext = createContext<AuthState | null>(null);

type StoredUser = AuthUser & { password: string };

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Simulate a brief session check so the loading screen is visible.
    let cancelled = false;
    (async () => {
      await wait(650);
      if (cancelled) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch {
        /* ignore */
      }
      setInitializing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await wait(700);
      const users = readUsers();
      const match = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (!match) {
        const err = new Error("No account found with this email.");
        (err as Error & { code?: string }).code = "not_found";
        throw err;
      }
      if (match.password !== password) {
        const err = new Error("Incorrect password. Please try again.");
        (err as Error & { code?: string }).code = "wrong_password";
        throw err;
      }
      persist({
        firstName: match.firstName,
        lastName: match.lastName,
        email: match.email,
      });
    },
    [persist],
  );

  const signUp = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      await wait(800);
      const users = readUsers();
      if (
        users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())
      ) {
        const err = new Error("An account with this email already exists.");
        (err as Error & { code?: string }).code = "exists";
        throw err;
      }
      users.push(data);
      writeUsers(users);
      persist({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    },
    [persist],
  );

  const signInWithGoogle = useCallback(async () => {
    await wait(600);
    persist({
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex@nera.app",
    });
  }, [persist]);

  const signOut = useCallback(() => {
    persist(null);
  }, [persist]);

  const sendReset = useCallback(async (_email: string) => {
    await wait(700);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      initializing,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      sendReset,
    }),
    [user, initializing, signIn, signUp, signInWithGoogle, signOut, sendReset],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function passwordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++;
  const labels = ["Too short", "Weak", "Fair", "Strong", "Excellent"] as const;
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}