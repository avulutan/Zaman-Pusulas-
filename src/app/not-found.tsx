"use client";

import Link from "next/link";
import { Compass, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto max-w-md text-center">
        {/* Logo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-10 w-10" />
        </div>

        {/* Error code */}
        <h1 className="text-7xl font-bold tracking-tighter text-primary">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight">
          Sayfa Bulunamadı
        </h2>
        <p className="mt-2 text-muted-foreground">
          Aradığın sayfa mevcut değil veya taşınmış olabilir.
          Pusulana güven ve doğru yöne dön! 🧭
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            render={<Link href="/dashboard" />}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Ana Panel
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
        </div>
      </div>
    </div>
  );
}
