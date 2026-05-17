"use client";

import * as React from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type Task,
  type TaskType,
  mockTodayTasks,
  mockUpcoming,
  taskTypeLabels,
} from "@/lib/mock-data";

// Color mapping for task types
const typeColor: Record<TaskType, string> = {
  lesson: "border-l-primary bg-primary/5",
  exam: "border-l-destructive bg-destructive/5",
  assignment: "border-l-chart-4 bg-chart-4/5",
  event: "border-l-chart-2 bg-chart-2/5",
  personal: "border-l-chart-3 bg-chart-3/5",
  study: "border-l-chart-5 bg-chart-5/5",
};

const typeDot: Record<TaskType, string> = {
  lesson: "bg-primary",
  exam: "bg-destructive",
  assignment: "bg-chart-4",
  event: "bg-chart-2",
  personal: "bg-chart-3",
  study: "bg-chart-5",
};

// Hours for the day view
const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 – 20:00

function getWeekDays(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDayShort(date: Date): string {
  return date.toLocaleDateString("tr-TR", { weekday: "short" });
}

function formatDayNum(date: Date): string {
  return date.getDate().toString();
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
}

// Simulate tasks on different days
function getTasksForDate(date: Date): Task[] {
  if (isToday(date)) return mockTodayTasks;
  // Scatter some upcoming tasks on future days for demo
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 1)
    return [
      {
        id: "w1",
        title: "Türk Dili Dersi",
        type: "lesson",
        priority: "medium",
        status: "planned",
        courseName: "Türk Dili",
        startTime: "10:00",
        endTime: "11:30",
        location: "Kampüs C Blok",
      },
    ];
  if (dayOfWeek === 3)
    return [
      {
        id: "w2",
        title: "Fizik Lab",
        type: "lesson",
        priority: "high",
        status: "planned",
        courseName: "Fizik",
        startTime: "13:00",
        endTime: "15:00",
        location: "Lab 3",
      },
      ...mockUpcoming.slice(0, 1),
    ];
  if (dayOfWeek === 5)
    return [
      {
        id: "w3",
        title: "Kütüphanede Çalışma",
        type: "study",
        priority: "medium",
        status: "planned",
        courseName: "Matematik",
        startTime: "14:00",
        endTime: "16:00",
        estimatedDuration: 120,
        location: "Kütüphane",
      },
    ];
  return [];
}

function CalendarEventCard({ task }: { task: Task }) {
  return (
    <div
      className={`rounded-md border-l-[3px] p-2 text-xs transition-colors hover:opacity-80 ${typeColor[task.type]}`}
    >
      <div className="flex items-center gap-1.5">
        <div className={`h-1.5 w-1.5 rounded-full ${typeDot[task.type]}`} />
        <span className="font-medium truncate">{task.title}</span>
      </div>
      {task.startTime && (
        <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          {task.startTime}
          {task.endTime && ` – ${task.endTime}`}
        </div>
      )}
      {task.location && (
        <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-2.5 w-2.5" />
          <span className="truncate">{task.location}</span>
        </div>
      )}
    </div>
  );
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<"week" | "day">("week");

  const weekDays = getWeekDays(currentDate);

  function goToPrevWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  }

  function goToNextWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Takvim</h1>
          <p className="mt-1 text-muted-foreground">
            {formatMonthYear(currentDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "week" | "day")}>
            <TabsList>
              <TabsTrigger value="week">Haftalık</TabsTrigger>
              <TabsTrigger value="day">Günlük</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevWeek}
          aria-label="Önceki hafta"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          id="calendar-today-btn"
        >
          Bugün
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextWeek}
          aria-label="Sonraki hafta"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(taskTypeLabels).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className={`h-2.5 w-2.5 rounded-full ${typeDot[type as TaskType]}`}
            />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {view === "week" ? (
        /* ========== WEEKLY VIEW ========== */
        <Card className="border-border/50 overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-border/50">
            {weekDays.map((day) => {
              const tasks = getTasksForDate(day);
              const today = isToday(day);
              return (
                <div key={day.toISOString()} className="min-h-[200px]">
                  {/* Day header */}
                  <div
                    className={`flex flex-col items-center border-b p-2 ${
                      today ? "bg-primary/5" : "bg-muted/30"
                    }`}
                  >
                    <span className="text-[10px] font-medium uppercase text-muted-foreground">
                      {formatDayShort(day)}
                    </span>
                    <span
                      className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                        today
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {formatDayNum(day)}
                    </span>
                  </div>
                  {/* Events */}
                  <div className="space-y-1 p-1.5">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <CalendarEventCard key={task.id} task={task} />
                      ))
                    ) : (
                      <p className="py-4 text-center text-[10px] text-muted-foreground/50">
                        —
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* ========== DAY VIEW ========== */
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-primary" />
              {currentDate.toLocaleDateString("tr-TR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {hours.map((hour) => {
                const timeStr = `${hour.toString().padStart(2, "0")}:00`;
                const todayTasks = getTasksForDate(currentDate);
                const tasksAtHour = todayTasks.filter((t) => {
                  if (!t.startTime) return false;
                  const h = parseInt(t.startTime.split(":")[0]);
                  return h === hour;
                });

                return (
                  <div key={hour} className="flex min-h-[56px]">
                    <div className="w-16 shrink-0 border-r border-border/30 p-2 text-right text-xs text-muted-foreground">
                      {timeStr}
                    </div>
                    <div className="flex-1 p-1.5">
                      {tasksAtHour.length > 0 && (
                        <div className="space-y-1">
                          {tasksAtHour.map((task) => (
                            <CalendarEventCard key={task.id} task={task} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
