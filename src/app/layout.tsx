import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zaman Pusulası — Öğrenciler İçin Akıllı Planlama Asistanı",
    template: "%s | Zaman Pusulası",
  },
  description:
    "Derslerini, sınavlarını, ödevlerini ve etkinliklerini tek planda topla. YZ destekli planlama asistanı ile zamanını en verimli şekilde yönet.",
  keywords: [
    "öğrenci planlama",
    "ders programı",
    "sınav takvimi",
    "çalışma asistanı",
    "zaman yönetimi",
    "yapay zeka planlama",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zaman Pusulası",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Zaman Pusulası",
    title: "Zaman Pusulası — Öğrenciler İçin Akıllı Planlama Asistanı",
    description:
      "Derslerini, sınavlarını ve etkinliklerini YZ destekli planlama asistanı ile yönet.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delay={300}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
