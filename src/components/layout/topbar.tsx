"use client";

import Link from "next/link";
import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/use-auth";

export function Topbar() {
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.name ?? "Elif Yılmaz";
  const displayEmail = user?.email ?? "elif@ogrenci.edu.tr";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      id="dashboard-topbar"
      className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6"
    >
      {/* Left — mobile menu + search */}
      <div className="flex items-center gap-2">
        <MobileNav />
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 cursor-pointer hover:bg-muted transition-colors">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Ara...</span>
          <kbd className="ml-6 hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:inline">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          id="notifications-btn"
          aria-label="Bildirimler"
          className="relative"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </Button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                id="user-avatar-btn"
                aria-label="Profil menüsü"
                className="rounded-full"
              />
            }
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/settings" />} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings" />} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive focus:text-destructive"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
