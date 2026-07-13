import type { CSSProperties, ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Topbar } from "./topbar";
import { AuthGate } from "@/components/auth/auth-gate";

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <AuthGate>
      <SidebarProvider
      style={
        {
          "--sidebar-width": "13rem",
          "--sidebar-width-icon": "3rem",
        } as CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </SidebarInset>
      </SidebarProvider>
    </AuthGate>
  );
}
