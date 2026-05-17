"use client";

import * as React from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  PauseCircle,
  CalendarDays,
  Target,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockWeeklyStats } from "@/lib/mock-data";

// Extended mock data for analytics
const dailyStats = [
  { day: "Pzt", planned: 4, completed: 3, studyMinutes: 90 },
  { day: "Sal", planned: 3, completed: 2, studyMinutes: 60 },
  { day: "Çar", planned: 5, completed: 4, studyMinutes: 120 },
  { day: "Per", planned: 3, completed: 3, studyMinutes: 75 },
  { day: "Cum", planned: 4, completed: 2, studyMinutes: 45 },
  { day: "Cmt", planned: 2, completed: 1, studyMinutes: 60 },
  { day: "Paz", planned: 1, completed: 0, studyMinutes: 30 },
];

const maxPlanned = Math.max(...dailyStats.map((d) => d.planned));

const upcomingDeadlines = [
  { title: "Fizik Lab Raporu", course: "Fizik", daysLeft: 1 },
  { title: "Türk Dili Ödevi", course: "Türk Dili", daysLeft: 3 },
  { title: "Matematik Final", course: "Matematik", daysLeft: 10 },
  { title: "Fizik Final", course: "Fizik", daysLeft: 13 },
];

export default function AnalyticsPage() {
  const completionRate = mockWeeklyStats.completionPercentage;
  const studyHours = Math.floor(mockWeeklyStats.studyTimeMinutes / 60);
  const studyMins = mockWeeklyStats.studyTimeMinutes % 60;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">İstatistikler</h1>
        <p className="mt-1 text-muted-foreground">
          Haftalık ilerlemeni ve çalışma alışkanlıklarını takip et.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Planlanan</p>
              <p className="text-2xl font-bold">{mockWeeklyStats.plannedTasks}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tamamlanan</p>
              <p className="text-2xl font-bold">{mockWeeklyStats.completedTasks}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-4/15 text-chart-4">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Çalışma Süresi</p>
              <p className="text-2xl font-bold">
                {studyHours} sa {studyMins > 0 ? `${studyMins} dk` : ""}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
              <PauseCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ertelenen</p>
              <p className="text-2xl font-bold">{mockWeeklyStats.postponedTasks}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly chart */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Haftalık Görev Takibi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simple bar chart */}
            <div className="space-y-3">
              {dailyStats.map((day) => (
                <div key={day.day} className="flex items-center gap-3">
                  <span className="w-8 shrink-0 text-sm font-medium text-muted-foreground">
                    {day.day}
                  </span>
                  <div className="flex-1 space-y-1">
                    {/* Planned bar */}
                    <div className="flex items-center gap-2">
                      <div className="h-3 flex-1 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary/30 transition-all"
                          style={{
                            width: `${(day.planned / maxPlanned) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-4 text-right text-[10px] text-muted-foreground">
                        {day.planned}
                      </span>
                    </div>
                    {/* Completed bar */}
                    <div className="flex items-center gap-2">
                      <div className="h-3 flex-1 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-chart-3 transition-all"
                          style={{
                            width: `${(day.completed / maxPlanned) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-4 text-right text-[10px] text-chart-3">
                        {day.completed}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary/30" />
                Planlanan
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-chart-3" />
                Tamamlanan
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Completion gauge */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tamamlama Oranı
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              {/* Circle progress */}
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg
                  className="h-full w-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${completionRate * 2.64} ${264 - completionRate * 2.64}`}
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <span className="absolute text-3xl font-bold">
                  %{completionRate}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {completionRate >= 70
                  ? "Harika gidiyorsun! 🎉"
                  : completionRate >= 50
                    ? "İyi yoldasın, devam et! 💪"
                    : "Biraz daha gayret, yapabilirsin! 🌱"}
              </p>
            </CardContent>
          </Card>

          {/* Upcoming deadlines */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="h-5 w-5 text-chart-4" />
                Yaklaşan Tarihler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingDeadlines.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.course}
                    </p>
                  </div>
                  <Badge
                    variant={item.daysLeft <= 3 ? "destructive" : "secondary"}
                    className="shrink-0"
                  >
                    {item.daysLeft} gün
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Haftalık Özet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bu hafta <span className="font-medium text-foreground">{mockWeeklyStats.plannedTasks} görev</span> planladın
            ve bunların <span className="font-medium text-foreground">{mockWeeklyStats.completedTasks} tanesini</span> tamamladın.
            Toplam <span className="font-medium text-foreground">{studyHours} saat {studyMins} dakika</span> çalıştın.
            {mockWeeklyStats.postponedTasks > 0 && (
              <> {mockWeeklyStats.postponedTasks} görevi ertelemeyi tercih ettin — ertelemeler azaldığında verimliliğin artacaktır.</>
            )}
            {completionRate >= 60
              ? " Genel olarak iyi bir hafta geçirdin, bu tempoyu koru! 🌟"
              : " Gelecek hafta biraz daha planlı çalışmayı deneyebilirsin. Sen yapabilirsin! 💪"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
