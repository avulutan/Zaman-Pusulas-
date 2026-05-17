import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNav() {
  return (
    <header
      id="landing-nav"
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" aria-label="Ana sayfa">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Zaman Pusulası
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            render={<Link href="/login" id="nav-login" />}
            variant="ghost"
            size="sm"
          >
            Giriş Yap
          </Button>
          <Button
            render={<Link href="/register" id="nav-register" />}
            size="sm"
          >
            Kayıt Ol
          </Button>
        </div>
      </nav>
    </header>
  );
}
