"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  User,
  GraduationCap,
  Clock,
  MapPin,
  Palette,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const TOTAL_STEPS = 4;

interface LocationEntry {
  id: string;
  name: string;
  travelMinutes: string;
}

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);

  // Step 1: Personal info
  const [name, setName] = React.useState("");
  const [educationLevel, setEducationLevel] = React.useState<string>("");
  const [schoolType, setSchoolType] = React.useState<string>("");

  // Step 2: Study preferences
  const [studyTime, setStudyTime] = React.useState<string>("morning");
  const [studyDuration, setStudyDuration] = React.useState("45");
  const [breakDuration, setBreakDuration] = React.useState("10");
  const [prepDuration, setPrepDuration] = React.useState("15");

  // Step 3: Locations
  const [locations, setLocations] = React.useState<LocationEntry[]>([
    { id: "loc-1", name: "Ev", travelMinutes: "0" },
    { id: "loc-2", name: "Kampüs", travelMinutes: "30" },
  ]);
  const [newLocationName, setNewLocationName] = React.useState("");
  const [newLocationTravel, setNewLocationTravel] = React.useState("15");

  // Step 4: Theme
  const [theme, setTheme] = React.useState<string>("system");
  const [accentColor, setAccentColor] = React.useState("blue");

  function addLocation() {
    if (!newLocationName.trim()) return;
    setLocations((prev) => [
      ...prev,
      {
        id: `loc-${Date.now()}`,
        name: newLocationName,
        travelMinutes: newLocationTravel,
      },
    ]);
    setNewLocationName("");
    setNewLocationTravel("15");
  }

  function removeLocation(id: string) {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }

  function handleFinish() {
    // In the future this will save to Supabase
    console.log("Profile setup complete:", {
      name,
      educationLevel,
      schoolType,
      studyTime,
      studyDuration,
      breakDuration,
      prepDuration,
      locations,
      theme,
      accentColor,
    });
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/30 p-4 sm:p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Compass className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Profilini Oluştur</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sana en uygun planlamayı sunabilmemiz için birkaç bilgiye ihtiyacımız var.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i + 1 <= step
                  ? "w-10 bg-primary"
                  : "w-6 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <Card className="border-border/50 shadow-lg">
          {step === 1 && (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Kişisel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="setup-name">Ad Soyad *</Label>
                  <Input
                    id="setup-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    <GraduationCap className="mr-1 inline h-3.5 w-3.5" />
                    Eğitim Düzeyi
                  </Label>
                  <Select value={educationLevel} onValueChange={(v) => v && setEducationLevel(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="highschool">Lise</SelectItem>
                        <SelectItem value="university">Üniversite</SelectItem>
                        <SelectItem value="graduate">Lisansüstü</SelectItem>
                        <SelectItem value="exam-prep">Sınav Hazırlığı</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Okul Türü</Label>
                  <Select value={schoolType} onValueChange={(v) => v && setSchoolType(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seçin (opsiyonel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="public">Devlet</SelectItem>
                        <SelectItem value="private">Özel</SelectItem>
                        <SelectItem value="foundation">Vakıf</SelectItem>
                        <SelectItem value="other">Diğer</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Çalışma Tercihleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Verimli Çalışma Zamanı</Label>
                  <Select value={studyTime} onValueChange={(v) => v && setStudyTime(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="morning">Sabah (06:00–12:00)</SelectItem>
                        <SelectItem value="afternoon">Öğleden Sonra (12:00–18:00)</SelectItem>
                        <SelectItem value="evening">Akşam (18:00–00:00)</SelectItem>
                        <SelectItem value="mixed">Karışık</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="setup-study">Çalışma (dk)</Label>
                    <Input
                      id="setup-study"
                      type="number"
                      min="15"
                      step="15"
                      value={studyDuration}
                      onChange={(e) => setStudyDuration(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setup-break">Mola (dk)</Label>
                    <Input
                      id="setup-break"
                      type="number"
                      min="5"
                      step="5"
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setup-prep">Hazırlık (dk)</Label>
                    <Input
                      id="setup-prep"
                      type="number"
                      min="0"
                      step="5"
                      value={prepDuration}
                      onChange={(e) => setPrepDuration(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Varsayılan çalışma oturumu, mola ve hazırlık sürelerini belirle.
                  Bunları daha sonra ayarlardan değiştirebilirsin.
                </p>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Sık Kullanılan Konumlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Gittiğin yerleri ve ortalama yol sürelerini ekle. Planlama
                  motoru çıkış zamanını hesaplarken bunları kullanacak.
                </p>

                {/* Existing locations */}
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 p-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{loc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {loc.travelMinutes} dk
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeLocation(loc.id)}
                          aria-label={`${loc.name} konumunu kaldır`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new location */}
                <div className="flex gap-2">
                  <Input
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="Konum adı (kütüphane, staj okulu...)"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={newLocationTravel}
                    onChange={(e) => setNewLocationTravel(e.target.value)}
                    className="w-20"
                    placeholder="dk"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={addLocation}
                    aria-label="Konum ekle"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="h-5 w-5 text-primary" />
                  Görünüm Tercihleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Tema</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "light", label: "Açık" },
                      { value: "dark", label: "Koyu" },
                      { value: "system", label: "Sistem" },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`rounded-lg border p-3 text-center text-sm font-medium transition-all ${
                          theme === t.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/50 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Ana Renk</Label>
                  <div className="flex gap-3">
                    {[
                      { value: "blue", class: "bg-blue-500" },
                      { value: "purple", class: "bg-purple-500" },
                      { value: "green", class: "bg-emerald-500" },
                      { value: "orange", class: "bg-orange-500" },
                      { value: "gray", class: "bg-gray-500" },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setAccentColor(color.value)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${color.class} transition-all ${
                          accentColor === color.value
                            ? "ring-2 ring-offset-2 ring-offset-background"
                            : "opacity-60 hover:opacity-80"
                        }`}
                        aria-label={color.value}
                      >
                        {accentColor === color.value && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Tüm tercihleri daha sonra Ayarlar sayfasından değiştirebilirsin.
                </p>
              </CardContent>
            </>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>

          <span className="text-sm text-muted-foreground">
            {step} / {TOTAL_STEPS}
          </span>

          {step < TOTAL_STEPS ? (
            <Button
              onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
              className="gap-1"
              disabled={step === 1 && !name.trim()}
            >
              İleri
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="gap-1">
              <Check className="h-4 w-4" />
              Tamamla
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
