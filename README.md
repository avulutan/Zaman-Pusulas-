# Zaman Pusulası
**Öğrenciler için YZ destekli akıllı planlama asistanı.**

Derslerini, sınavlarını, ödevlerini, etkinliklerini ve çalışma oturumlarını tek planda topla. Gerçek zamanlı çakışma uyarıları, çıkış saati hatırlatmaları ve YZ destekli plan önerileri al.

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

| Araç | Minimum Versiyon |
|------|-----------------|
| [Node.js](https://nodejs.org/) | **v18+** (önerilen: v20+) |
| npm | **v9+** (Node ile birlikte gelir) |
| Git | herhangi bir güncel sürüm |

### 1. Projeyi İndir

```bash
# Git ile klonla
git clone <repo-url> zaman-pusulasi
cd zaman-pusulasi

# VEYA dosyaları kopyalayıp klasöre gir
cd zaman-pusulasi
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Uygulamayı Başlat

```bash
npm run dev
```

Tarayıcıda aç: **http://localhost:3000**

> ✅ **Hepsi bu!** Uygulama Supabase olmadan "Demo Modu"nda çalışır. Tüm sayfalar mock data ile fonksiyoneldir.

---

## 📱 Başka Bir Cihazdan Erişim

Dev server başladığında terminalde bir **Network** adresi görürsün:

```
▲ Next.js 16.2.4 (Turbopack)
- Local:    http://localhost:3000
- Network:  http://192.168.x.x:3000    ← Bu adres
```

Aynı Wi-Fi ağındaki herhangi bir cihazda (telefon, tablet, başka bilgisayar) bu **Network** adresini tarayıcıya yaz.

---

## ⚙️ Ortam Değişkenleri (Opsiyonel)

Uygulama ortam değişkenleri olmadan çalışır. Gerçek veritabanı ve YZ chatbot kullanmak istersen:

```bash
# Örnek dosyayı kopyala
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenle:

```env
# Supabase — supabase.com'dan proje oluşturup al
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...

# Google Gemini API — aistudio.google.com'dan al
LLM_API_KEY=AIza...
LLM_MODEL=gemini-2.0-flash
```

### Supabase Veritabanı Kurulumu

Eğer Supabase kullanacaksan:

1. [supabase.com](https://supabase.com) adresinde yeni proje oluştur
2. Proje ayarlarından API URL ve Key'leri `.env.local` dosyasına yaz
3. SQL Editor'de `supabase/schema.sql` dosyasını çalıştır:

```bash
# Supabase CLI ile (opsiyonel)
npx supabase db push
```

---

## 📋 Kullanılabilir Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlat (port 3000) |
| `npm run build` | Üretim için derle |
| `npm start` | Üretim sunucusunu başlat |
| `npm run lint` | Kod kalitesi kontrolü |
| `npm run test:e2e` | E2E testlerini çalıştır (Playwright) |
| `npm run test:e2e:ui` | E2E testlerini görsel arayüzle çalıştır |

### E2E Testleri Çalıştırma

```bash
# Playwright tarayıcılarını kur (ilk seferde)
npx playwright install

# Testleri çalıştır
npm run test:e2e
```

---

## 🗂️ Proje Yapısı

```
zaman-pusulasi/
├── e2e/                    # Playwright E2E testleri
├── public/
│   ├── icons/              # PWA ikonları (192px, 512px)
│   └── manifest.json       # PWA manifest
├── supabase/
│   └── schema.sql          # Veritabanı şeması
├── src/
│   ├── app/                # Next.js App Router sayfaları
│   │   ├── (dashboard)/    # Dashboard layout grubu
│   │   │   ├── analytics/  # İstatistikler
│   │   │   ├── calendar/   # Takvim
│   │   │   ├── chat/       # YZ Chatbot
│   │   │   ├── dashboard/  # Ana panel
│   │   │   ├── profile-setup/ # Profil kurulumu
│   │   │   ├── settings/   # Ayarlar
│   │   │   ├── study/      # Ders çalışma asistanı
│   │   │   └── tasks/      # Görev yönetimi
│   │   ├── api/chat/       # LLM API endpoint
│   │   ├── login/          # Giriş sayfası
│   │   └── register/       # Kayıt sayfası
│   ├── components/         # Yeniden kullanılabilir bileşenler
│   │   ├── landing/        # Ana sayfa bileşenleri
│   │   ├── layout/         # Sidebar, Topbar, MobileNav
│   │   ├── tasks/          # Görev form dialog
│   │   └── ui/             # shadcn/ui bileşenleri
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Yardımcı fonksiyonlar
│       ├── supabase/       # Supabase client (browser/server)
│       ├── data.ts         # CRUD veri katmanı
│       ├── mock-data.ts    # Demo verileri
│       └── planner.ts      # Planlama motoru
├── .env.local.example      # Ortam değişkenleri şablonu
├── package.json
├── playwright.config.ts    # E2E test yapılandırması
└── tsconfig.json
```

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| İkonlar | Lucide React |
| Veritabanı | Supabase (PostgreSQL + Auth + RLS) |
| YZ | Google Gemini API |
| Test | Playwright |
| PWA | Web App Manifest + İkonlar |

---

## 🔧 Sorun Giderme

### "Port 3000 is in use"
```bash
# Eski sunucuyu kapat
kill $(lsof -t -i:3000)
# Tekrar başlat
npm run dev
```

### "Module not found" hatası
```bash
# node_modules'ı sil ve yeniden yükle
rm -rf node_modules .next
npm install
```

### Windows'ta çalıştırma
Aynı adımlar geçerli. PowerShell veya CMD kullan:
```powershell
npm install
npm run dev
```

### macOS'ta çalıştırma
Aynı adımlar geçerli. Terminal kullan:
```bash
npm install
npm run dev
```

---

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
