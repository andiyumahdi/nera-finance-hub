import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nera" },
      { name: "description", content: "Manage your profile, preferences, notifications, and security." },
      { property: "og:title", content: "Settings — Nera" },
      { property: "og:description", content: "Manage your profile, preferences, notifications, and security." },
    ],
  }),
  component: SettingsPage,
});

function SettingsGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="lg:pt-1">
        <h2 className="text-[13px] font-medium">{title}</h2>
        {description && (
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      <Card className="shadow-none">
        <CardContent className="p-5">{children}</CardContent>
      </Card>
    </section>
  );
}

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <AppLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="mx-auto max-w-4xl space-y-10">
        <SettingsGroup title="Profile" description="Your personal details and how we reach you.">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="s-first" className="text-[12px]">First name</Label>
                <Input id="s-first" defaultValue="Alex" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-last" className="text-[12px]">Last name</Label>
                <Input id="s-last" defaultValue="Morgan" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-email" className="text-[12px]">Email</Label>
              <Input id="s-email" type="email" defaultValue="alex@nera.app" />
            </div>
            <div className="flex justify-end pt-1">
              <Button size="sm">Save changes</Button>
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup title="Appearance" description="Pick how Nera looks to you across sessions.">
          <RadioGroup
            value={theme}
            onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {(["light", "dark", "system"] as const).map((t) => (
              <Label
                key={t}
                htmlFor={`theme-${t}`}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/70 p-3 text-[13px] hover:bg-accent has-[[data-state=checked]]:border-primary/60 has-[[data-state=checked]]:bg-accent"
              >
                <RadioGroupItem id={`theme-${t}`} value={t} />
                <span className="capitalize">{t}</span>
              </Label>
            ))}
          </RadioGroup>
        </SettingsGroup>

        <SettingsGroup title="Regional" description="Currency and calendar defaults.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[12px]">Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="GBP">GBP — British Pound</SelectItem>
                  <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px]">Week starts on</Label>
              <Select defaultValue="mon">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sun">Sunday</SelectItem>
                  <SelectItem value="mon">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup title="Notifications" description="Choose what Nera should tell you about.">
          <div className="divide-y divide-border/60">
            {[
              { id: "n-weekly", label: "Weekly summary", desc: "Every Monday morning." },
              { id: "n-budget", label: "Budget alerts", desc: "When you're close to a limit." },
              { id: "n-large", label: "Large transactions", desc: "For any charge over $500." },
            ].map((n, i) => (
              <div
                key={n.id}
                className={`flex items-center justify-between gap-3 ${i === 0 ? "pb-4" : "py-4 last:pb-0"}`}
              >
                <div className="min-w-0">
                  <Label htmlFor={n.id} className="text-[13px] font-medium">{n.label}</Label>
                  <p className="text-[11px] text-muted-foreground">{n.desc}</p>
                </div>
                <Switch id={n.id} defaultChecked />
              </div>
            ))}
          </div>
        </SettingsGroup>

        <SettingsGroup title="Security" description="Protect your account with 2FA and a strong password.">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[13px] font-medium">Two-factor authentication</Label>
                <p className="text-[11px] text-muted-foreground">Require a second factor on sign in.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw" className="text-[12px]">Change password</Label>
              <Input id="pw" type="password" placeholder="New password" />
            </div>
            <div className="flex justify-end">
              <Button size="sm">Update password</Button>
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup title="Billing" description="Your plan and renewal.">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium">Nera Pro</p>
              <p className="text-[11px] text-muted-foreground">$12 / month · renews Aug 12, 2026</p>
            </div>
            <Button variant="outline" size="sm">Manage subscription</Button>
          </div>
        </SettingsGroup>
      </div>
    </AppLayout>
  );
}
