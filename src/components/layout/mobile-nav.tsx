"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Compass, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";

export function MobileNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <>
      {/* Hamburger drawer — visible on small screens */}
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              id="mobile-menu-trigger"
              aria-label="Menüyü aç"
            />
          }
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="flex h-16 flex-row items-center gap-2 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Compass className="h-5 w-5" />
            </div>
            <SheetTitle className="text-lg font-bold">Zaman Pusulası</SheetTitle>
          </SheetHeader>
          <Separator />
          <nav className="space-y-1 px-3 py-4" aria-label="Mobil menü">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Separator />
          <div className="space-y-1 px-3 py-4">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              Ayarlar
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Çıkış Yap
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bottom tab bar — visible on small screens */}
      <nav
        id="mobile-bottom-nav"
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur-lg md:hidden"
        aria-label="Alt menü"
      >
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
