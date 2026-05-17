"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  CalendarDays,
  ListTodo,
  BookOpen,
  Bot,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Ana Panel", icon: LayoutDashboard },
  { href: "/calendar", label: "Takvim", icon: CalendarDays },
  { href: "/tasks", label: "Görevler", icon: ListTodo },
  { href: "/study", label: "Ders Çalış", icon: BookOpen },
  { href: "/chat", label: "Chatbot", icon: Bot },
  { href: "/analytics", label: "İstatistikler", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside
      id="dashboard-sidebar"
      className="hidden md:flex md:w-64 flex-col border-r bg-sidebar"
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25">
          <Compass className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">Zaman Pusulası</span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Ana menü">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    id={`nav-${item.href.slice(1)}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  />
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom section */}
      <div className="space-y-1 px-3 py-4">
        <Link
          href="/settings"
          id="nav-settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Ayarlar
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
          id="nav-logout"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Çıkış Yap
        </Button>
      </div>
    </aside>
  );
}
