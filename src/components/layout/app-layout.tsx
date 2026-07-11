import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Topbar } from "./topbar";

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
