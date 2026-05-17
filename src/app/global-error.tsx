"use client";

import { Compass, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12 text-foreground">
          <div className="mx-auto max-w-md text-center">
            {/* Logo */}
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <Compass className="h-10 w-10" />
            </div>

            {/* Message */}
            <h1 className="text-2xl font-bold tracking-tight">
              Bir Şeyler Ters Gitti
            </h1>
            <p className="mt-2 text-muted-foreground">
              Beklenmeyen bir hata oluştu. Endişelenme, verilerini kaybetmedin.
              Sayfayı yenilemeyi dene.
            </p>

            {error.digest && (
              <p className="mt-3 rounded-lg bg-muted p-2 font-mono text-xs text-muted-foreground">
                Hata kodu: {error.digest}
              </p>
            )}

            {/* Actions */}
            <div className="mt-8">
              <Button onClick={reset} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Tekrar Dene
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
