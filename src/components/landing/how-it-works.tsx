import { CalendarDays, Clock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CalendarDays,
    title: "Planını Oluştur",
    description:
      "Ders programını, sınav tarihlerini ve ödevlerini ekle. Yol ve hazırlık sürelerini gir.",
    color: "text-primary bg-primary/10",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "YZ Asistanı Kullan",
    description:
      "Doğal dilde planını sor, çakışma ve aşırı yüklenme uyarılarını al, yeniden düzenleme önerileri gör.",
    color: "text-chart-2 bg-chart-2/10",
  },
  {
    number: "03",
    icon: Clock,
    title: "Zamanını Yönet",
    description:
      "Gerçek zamanlı çıkış saati hatırlatmaları, mola önerileri ve boş zaman aralıklarını gör.",
    color: "text-chart-4 bg-chart-4/10",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Hedeflerini Takip Et",
    description:
      "Haftalık istatistikleri gör, tamamlama oranını izle, ilerleme grafiklerinle motive ol.",
    color: "text-chart-3 bg-chart-3/10",
  },
];

const stats = [
  { value: "7,394", label: "Satır Kod" },
  { value: "13", label: "Sayfa" },
  { value: "27", label: "Bileşen" },
  { value: "∞", label: "Potansiyel" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-24 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div
        className="absolute inset-0 -z-10 opacity-20 dark:opacity-10"
        aria-hidden="true"
      >
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gradient-to-r from-chart-2/30 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Nasıl Çalışır
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            4 Adımda Planla, Başar
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Zaman Pusulası, karmaşık ders programlarını basit ve yönetilebilir
            günlük planlara dönüştürür.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="group relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-10 hidden h-px w-8 bg-border lg:block" aria-hidden="true">
                  <ArrowRight className="absolute -right-2 -top-1.5 h-3 w-3 text-muted-foreground/50" />
                </div>
              )}

              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color} transition-transform group-hover:scale-110`}>
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  Adım {step.number}
                </span>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-20 rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
