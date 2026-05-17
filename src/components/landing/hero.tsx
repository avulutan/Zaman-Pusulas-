import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero-section"
      className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8"
    >
      {/* Decorative gradient background */}
      <div
        className="absolute inset-0 -z-10 opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-transparent blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[600px] rounded-full bg-gradient-to-tl from-chart-2/30 via-chart-5/20 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            YZ Destekli Planlama
          </div>
        </div>

        {/* Logo + Title */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Compass className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Zaman Pusulası
          </h1>
        </div>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Derslerini, ödevlerini, etkinliklerini ve yol süreni{" "}
          <span className="font-semibold text-foreground">tek planda</span> topla.
          Günlük programını gerçekçi zaman hesabıyla oluştur, çalışma oturumları
          önerileri al ve planın bozulduğunda yeniden düzenle.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            render={<Link href="/register" id="cta-register" />}
            size="lg"
            className="gap-2 text-base shadow-lg shadow-primary/20"
          >
            Ücretsiz Başla
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            render={<Link href="/login" id="cta-login" />}
            variant="outline"
            size="lg"
            className="gap-2 text-base"
          >
            Giriş Yap
          </Button>
        </div>
      </div>
    </section>
  );
}
