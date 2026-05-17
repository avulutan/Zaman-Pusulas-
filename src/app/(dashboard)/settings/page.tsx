"use client";

import * as React from "react";
import {
  Settings,
  User,
  Palette,
  Bell,
  Accessibility,
  Shield,
  Check,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

const accentColors = [
  { name: "Mavi", value: "blue", class: "bg-blue-500" },
  { name: "Mor", value: "purple", class: "bg-purple-500" },
  { name: "Yeşil", value: "green", class: "bg-emerald-500" },
  { name: "Turuncu", value: "orange", class: "bg-orange-500" },
  { name: "Gri", value: "gray", class: "bg-gray-500" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = React.useState("blue");
  const [fontSize, setFontSize] = React.useState("normal");
  const [highContrast, setHighContrast] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [simpleMode, setSimpleMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [examReminders, setExamReminders] = React.useState(true);
  const [studyReminders, setStudyReminders] = React.useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
        <p className="mt-1 text-muted-foreground">
          Profilini, temayı, bildirimleri ve erişilebilirlik tercihlerini düzenle.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Profil Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Ad Soyad</Label>
              <Input id="settings-name" defaultValue="Elif Yılmaz" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">E-posta</Label>
              <Input
                id="settings-email"
                type="email"
                defaultValue="elif@ogrenci.edu.tr"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                E-posta adresi değiştirilemez.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Eğitim Düzeyi</Label>
              <Select defaultValue="university">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="highschool">Lise</SelectItem>
                    <SelectItem value="university">Üniversite</SelectItem>
                    <SelectItem value="graduate">Lisansüstü</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-study-duration">Çalışma Süresi (dk)</Label>
                <Input
                  id="settings-study-duration"
                  type="number"
                  defaultValue="45"
                  min="15"
                  step="15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-break-duration">Mola Süresi (dk)</Label>
                <Input
                  id="settings-break-duration"
                  type="number"
                  defaultValue="10"
                  min="5"
                  step="5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-prep-duration">
                Varsayılan Hazırlık Süresi (dk)
              </Label>
              <Input
                id="settings-prep-duration"
                type="number"
                defaultValue="15"
                min="0"
                step="5"
              />
            </div>
            <Button size="sm" className="gap-1">
              <Check className="h-3.5 w-3.5" />
              Kaydet
            </Button>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" />
              Tema Ayarları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme selection */}
            <div className="space-y-3">
              <Label>Tema</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "light", label: "Açık", icon: Sun },
                  { value: "dark", label: "Koyu", icon: Moon },
                  { value: "system", label: "Sistem", icon: Monitor },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                      theme === t.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <t.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Accent color */}
            <div className="space-y-3">
              <Label>Ana Renk</Label>
              <div className="flex gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${color.class} ${
                      accentColor === color.value
                        ? "ring-2 ring-offset-2 ring-offset-background"
                        : "opacity-60 hover:opacity-80"
                    }`}
                    aria-label={color.name}
                    title={color.name}
                  >
                    {accentColor === color.value && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Renk tercihi gelecek güncellemede uygulanacak.
              </p>
            </div>

            <Separator />

            {/* Font size */}
            <div className="space-y-3">
              <Label>Yazı Boyutu</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "small", label: "Küçük" },
                  { value: "normal", label: "Normal" },
                  { value: "large", label: "Büyük" },
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`rounded-lg border p-2 text-center text-xs font-medium transition-all ${
                      fontSize === size.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Accessibility className="h-5 w-5 text-primary" />
              Erişilebilirlik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Yüksek Kontrast</Label>
                <p className="text-xs text-muted-foreground">
                  Daha belirgin renkler ve kenarlıklar
                </p>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
                id="high-contrast-switch"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Animasyonları Azalt</Label>
                <p className="text-xs text-muted-foreground">
                  Geçiş ve hareket efektlerini kapat
                </p>
              </div>
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
                id="reduced-motion-switch"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sade Görünüm</Label>
                <p className="text-xs text-muted-foreground">
                  Daha az görsel detay, daha basit arayüz
                </p>
              </div>
              <Switch
                checked={simpleMode}
                onCheckedChange={setSimpleMode}
                id="simple-mode-switch"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-primary" />
              Bildirimler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bildirimler</Label>
                <p className="text-xs text-muted-foreground">
                  Uygulama içi bildirimleri aç/kapat
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                id="notifications-switch"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sınav Hatırlatmaları</Label>
                <p className="text-xs text-muted-foreground">
                  Sınav tarihinden 3 gün ve 1 gün önce
                </p>
              </div>
              <Switch
                checked={examReminders}
                onCheckedChange={setExamReminders}
                id="exam-reminders-switch"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Çalışma Hatırlatmaları</Label>
                <p className="text-xs text-muted-foreground">
                  Günlük çalışma saatinde bildirim
                </p>
              </div>
              <Switch
                checked={studyReminders}
                onCheckedChange={setStudyReminders}
                id="study-reminders-switch"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Gizlilik ve Veri Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Verilerini güvende tutmak bizim için önemli. Kişisel bilgilerin
              yalnızca sana özel planlama deneyimi sunmak için kullanılır ve
              üçüncü taraflarla paylaşılmaz.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Shield className="mr-1 h-3 w-3" />
                Veriler şifrelenmiş
              </Badge>
              <Badge variant="secondary">
                <Shield className="mr-1 h-3 w-3" />
                Satır düzeyinde güvenlik
              </Badge>
              <Badge variant="secondary">
                <Shield className="mr-1 h-3 w-3" />
                API anahtarları sunucu tarafında
              </Badge>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Verileri Dışa Aktar
              </Button>
              <Button variant="destructive" size="sm">
                Hesabı Sil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
