import {
  CalendarDays,
  BookOpen,
  Bot,
  MapPin,
  BarChart3,
  Settings2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: CalendarDays,
    title: "Akıllı Takvim",
    description:
      "Derslerini, sınavlarını ve etkinliklerini günlük, haftalık ve aylık görünümde takip et.",
  },
  {
    icon: BookOpen,
    title: "Ders Çalışma Asistanı",
    description:
      "Sınav tarihine göre çalışma planı oluştur, konuları zorluk düzeyine göre sırala.",
  },
  {
    icon: Bot,
    title: "YZ Chatbot",
    description:
      "Doğal dille görev ekle, günlük plan özeti al ve plan bozulduğunda alternatif öneriler sun.",
  },
  {
    icon: MapPin,
    title: "Yol ve Hazırlık Süresi",
    description:
      "Etkinlik saatinden geriye doğru hazırlık ve yol süresini plana dahil et.",
  },
  {
    icon: BarChart3,
    title: "İlerleme Takibi",
    description:
      "Haftalık tamamlama oranını, çalışma süresini ve erteleme eğilimini gör.",
  },
  {
    icon: Settings2,
    title: "Kişiselleştirme",
    description:
      "Tema, renk, navbar düzeni ve erişilebilirlik ayarlarını ihtiyacına göre düzenle.",
  },
];

export function Features() {
  return (
    <section
      id="features-section"
      className="mx-auto max-w-6xl px-6 py-20 lg:px-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Öğrenciler İçin Tasarlandı
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Zaman Pusulası, öğrenci yaşamının karmaşıklığını sade ve erişilebilir
          bir arayüzde birleştirir.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
