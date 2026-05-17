"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  mockTodayTasks,
  mockUpcoming,
  mockWeeklyStats,
  taskTypeLabels,
  taskPriorityLabels,
} from "@/lib/mock-data";
import {
  sortByDeadlineAndPriority,
  getDepartureAdvice,
  detectConflicts,
  getOverloadSuggestions,
  estimateFreeBlocks,
  formatTime,
} from "@/lib/planner";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "İyi günler";
  return "İyi akşamlar";
}

function formatDate(): string {
  return new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const greeting = getGreeting();
  const dateStr = formatDate();

  // ─── Planning engine computations ────────────────────
  const sortedTasks = sortByDeadlineAndPriority(mockTodayTasks);
  const conflicts = detectConflicts(mockTodayTasks);
  const overloadSuggestions = getOverloadSuggestions(mockTodayTasks);
  const freeBlocks = estimateFreeBlocks(mockTodayTasks);
  const totalFreeMinutes = freeBlocks.reduce(
    (acc, b) => acc + (b.end - b.start),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting}, Elif! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">{dateStr}</p>
      </div>

      {/* Conflict / Overload Alerts */}
      {(conflicts.length > 0 || overloadSuggestions.length > 0) && (
        <div className="space-y-2">
          {conflicts.map((c, i) => (
            <div
              key={`conflict-${i}`}
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Çakışma Tespit Edildi</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">{c.taskA.title}</span> ve{" "}
                  <span className="font-medium">{c.taskB.title}</span> arasında{" "}
                  {c.overlapMinutes} dakika çakışma var (hazırlık/yol süresi dahil).
                </p>
              </div>
            </div>
          ))}
          {overloadSuggestions.map((s, i) => (
            <div
              key={`overload-${i}`}
              className="flex items-start gap-2 rounded-lg border border-chart-4/30 bg-chart-4/5 p-3 text-sm"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
              <p className="text-xs text-muted-foreground">{s.reason}</p>
            </div>
          ))}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bugünkü Görevler</p>
              <p className="text-2xl font-bold">{mockTodayTasks.length}</p>
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
              <p className="text-2xl font-bold">
                {mockWeeklyStats.completedTasks}/{mockWeeklyStats.plannedTasks}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tamamlama Oranı</p>
              <p className="text-2xl font-bold">
                %{mockWeeklyStats.completionPercentage}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-4/15 text-chart-4">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Boş Zaman</p>
              <p className="text-2xl font-bold">
                {Math.floor(totalFreeMinutes / 60)} sa {totalFreeMinutes % 60} dk
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Plan — main column */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Bugünkü Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedTasks.map((task) => {
              const departureAdvice = getDepartureAdvice(task);
              return (
                <div
                  key={task.id}
                  className="group flex items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
                >
                  {/* Time */}
                  <div className="w-14 shrink-0 pt-0.5 text-center">
                    {task.startTime ? (
                      <p className="text-sm font-semibold">{task.startTime}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Esnek</p>
                    )}
                  </div>

                  <Separator
                    orientation="vertical"
                    className="h-auto self-stretch"
                  />

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{task.title}</p>
                      <Badge variant="secondary" className="text-[10px]">
                        {taskTypeLabels[task.type]}
                      </Badge>
                      {task.priority === "high" && (
                        <Badge variant="destructive" className="text-[10px]">
                          {taskPriorityLabels[task.priority]}
                        </Badge>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {task.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {task.location}
                        </span>
                      )}
                      {task.prepDuration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Hazırlık: {task.prepDuration} dk
                        </span>
                      )}
                      {task.travelDuration && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Yol: {task.travelDuration} dk
                        </span>
                      )}
                      {task.estimatedDuration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedDuration} dk
                        </span>
                      )}
                    </div>
                    {/* Departure advice from planner */}
                    {departureAdvice && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
                        <Sparkles className="h-3 w-3" />
                        {departureAdvice}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Free time blocks */}
          {freeBlocks.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-chart-2" />
                  Boş Zaman Aralıkları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {freeBlocks.slice(0, 4).map((block, i) => {
                  const duration = block.end - block.start;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-chart-2/20 bg-chart-2/5 p-2.5"
                    >
                      <span className="text-sm">
                        {formatTime(block.start)} – {formatTime(block.end)}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {duration} dk
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Upcoming deadlines */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
                Yaklaşan Tarihler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockUpcoming.map((task) => {
                const deadline = task.deadline
                  ? new Date(task.deadline)
                  : null;
                const daysLeft = deadline
                  ? Math.ceil(
                      (deadline.getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : null;

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.courseName}
                      </p>
                    </div>
                    {daysLeft !== null && (
                      <Badge
                        variant={daysLeft <= 3 ? "destructive" : "secondary"}
                        className="shrink-0"
                      >
                        {daysLeft} gün
                      </Badge>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* AI suggestion card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                YZ Asistan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Bugün {mockTodayTasks.length} görevin var.{" "}
                {getDepartureAdvice(
                  sortedTasks.find((t) => t.startTime && t.travelDuration) ??
                    sortedTasks[0]
                ) && (
                  <>
                    İlk görev için{" "}
                    <span className="font-medium text-foreground">
                      {getDepartureAdvice(
                        sortedTasks.find(
                          (t) => t.startTime && t.travelDuration
                        )!
                      )}
                    </span>
                    .{" "}
                  </>
                )}
                {conflicts.length > 0 && (
                  <span className="font-medium text-destructive">
                    {conflicts.length} çakışma tespit edildi!{" "}
                  </span>
                )}
                Detaylı plan için chatbot&apos;a sor.
              </p>
              <Link
                href="/chat"
                className="mt-3 inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-primary hover:bg-accent transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Chatbot&apos;a Sor
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
