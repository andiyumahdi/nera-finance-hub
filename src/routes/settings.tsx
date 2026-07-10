import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <AppLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="mx-auto max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="s-first">First name</Label>
                    <Input id="s-first" defaultValue="Alex" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s-last">Last name</Label>
                    <Input id="s-last" defaultValue="Morgan" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-email">Email</Label>
                  <Input id="s-email" type="email" defaultValue="alex@nera.app" />
                </div>
                <div className="flex justify-end">
                  <Button size="sm">Save changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Appearance</CardTitle>
                <p className="text-xs text-muted-foreground">Pick how Nera looks to you.</p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={theme}
                  onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                >
                  {(["light", "dark", "system"] as const).map((t) => (
                    <Label
                      key={t}
                      htmlFor={`theme-${t}`}
                      className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
                    >
                      <RadioGroupItem id={`theme-${t}`} value={t} />
                      <span className="capitalize">{t}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Regional</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Currency</Label>
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
                  <Label>Week starts on</Label>
                  <Select defaultValue="mon">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sun">Sunday</SelectItem>
                      <SelectItem value="mon">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "n-weekly", label: "Weekly summary", desc: "Every Monday morning." },
                  { id: "n-budget", label: "Budget alerts", desc: "When you're close to a limit." },
                  { id: "n-large", label: "Large transactions", desc: "For any charge over $500." },
                ].map((n) => (
                  <div key={n.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Label htmlFor={n.id} className="text-sm font-medium">{n.label}</Label>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch id={n.id} defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-factor authentication</Label>
                    <p className="text-xs text-muted-foreground">Require a second factor on sign in.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw">Change password</Label>
                  <Input id="pw" type="password" placeholder="New password" />
                </div>
                <div className="flex justify-end">
                  <Button size="sm">Update password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Nera Pro</p>
                  <p className="text-xs text-muted-foreground">$12 / month · renews Aug 12, 2026</p>
                </div>
                <Button variant="outline" size="sm">Manage subscription</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
