"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        // Dev mode: show success and redirect
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          router.push("/profile-setup");
        }, 1500);
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          router.push("/profile-setup");
        }, 1500);
        return;
      }

      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Bu e-posta adresi zaten kayıtlı.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // Show success state with email confirmation message
      setSuccess(true);
      setLoading(false);

      // Auto-redirect to profile setup after a short delay
      setTimeout(() => {
        router.push("/profile-setup");
        router.refresh();
      }, 2000);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Simple top bar */}
      <header className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Ana sayfa">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">Zaman Pusulası</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Register form */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-border/50 shadow-xl shadow-primary/5" id="register-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
            <CardDescription>
              Ücretsiz hesap oluştur ve planlamaya başla
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chart-3/10">
                  <CheckCircle2 className="h-8 w-8 text-chart-3" />
                </div>
                <h3 className="font-semibold">Hesap Oluşturuldu! 🎉</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Profilini oluşturmak için yönlendiriliyorsun...
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Adınız Soyadınız"
                        className="pl-10"
                        required
                        autoComplete="name"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@ogrenci.edu.tr"
                        className="pl-10"
                        required
                        autoComplete="email"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="En az 8 karakter"
                        className="pl-10"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Şifre Tekrar</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password-confirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Şifreyi tekrar gir"
                        className="pl-10"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-2" id="register-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Hesap oluşturuluyor...
                      </>
                    ) : (
                      <>
                        Hesap Oluştur
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Zaten hesabın var mı?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
                id="login-link"
              >
                Giriş Yap
              </Link>
            </p>
            <p className="text-center text-xs text-muted-foreground/70">
              Kayıt olarak gizlilik politikasını ve kullanım koşullarını kabul etmiş olursun.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
