import { Compass } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer id="site-footer" className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold">Zaman Pusulası</span>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground sm:text-right">
            <p>Öğrenciler için YZ destekli planlama asistanı.</p>
            <p className="mt-1">
              Gizliliğine saygı duyar, verilerini güvende tutar.
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 Zaman Pusulası. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <span>Erişilebilirlik</span>
            <span>Gizlilik</span>
            <span>Kullanım Koşulları</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
