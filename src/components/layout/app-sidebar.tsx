import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Target,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const workspaceItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Goals", url: "/goals", icon: Target },
] as const;

const accountItems = [
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const renderItem = (item: { title: string; url: string; icon: typeof LayoutDashboard }) => {
    const active = pathname === item.url || pathname.startsWith(item.url + "/");
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={active}
          tooltip={item.title}
          className="h-8 gap-2.5 rounded-md px-2 text-[13px] font-normal text-sidebar-foreground/80 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-none hover:bg-sidebar-accent/60"
        >
          <Link to={item.url} className="flex items-center gap-2.5">
            <item.icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
            <span className="truncate">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-3 py-4">
        <div className="flex h-8 items-center gap-2">
          <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          {!collapsed && (
            <span className="truncate text-[13px] font-semibold tracking-tight">Nera</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-6 px-2">
        <SidebarGroup className="p-0">
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {workspaceItems.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="p-0">
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Account
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {accountItems.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-md px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            AM
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium">Alex Morgan</span>
              <span className="truncate text-[11px] text-muted-foreground">alex@nera.app</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
