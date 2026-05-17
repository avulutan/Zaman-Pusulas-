"use client";

import * as React from "react";
import {
  BookOpen,
  Plus,
  Clock,
  CalendarDays,
  CheckCircle2,
  Circle,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { mockCourses, type StudyTopic } from "@/lib/mock-data";

// Mock study data
const mockStudyTopics: StudyTopic[] = [
  { id: "st1", courseId: "c1", title: "Türev ve Uygulamaları", difficulty: "hard", estimatedMinutes: 90, completed: true },
  { id: "st2", courseId: "c1", title: "İntegral Hesabı", difficulty: "hard", estimatedMinutes: 120, completed: false },
  { id: "st3", courseId: "c1", title: "Lineer Denklemler", difficulty: "medium", estimatedMinutes: 60, completed: false },
  { id: "st4", courseId: "c1", title: "Matris İşlemleri", difficulty: "easy", estimatedMinutes: 45, completed: true },
  { id: "st5", courseId: "c2", title: "Newton Yasaları", difficulty: "medium", estimatedMinutes: 60, completed: true },
  { id: "st6", courseId: "c2", title: "Enerji ve Momentum", difficulty: "hard", estimatedMinutes: 90, completed: false },
  { id: "st7", courseId: "c2", title: "Dalga Optiği", difficulty: "medium", estimatedMinutes: 75, completed: false },
  { id: "st8", courseId: "c3", title: "Öğrenme Kuramları", difficulty: "easy", estimatedMinutes: 45, completed: true },
  { id: "st9", courseId: "c3", title: "Ölçme ve Değerlendirme", difficulty: "medium", estimatedMinutes: 60, completed: false },
];

const mockExams = [
  { courseId: "c1", courseName: "Matematik", examDate: "2026-05-25", daysLeft: 10 },
  { courseId: "c2", courseName: "Fizik", examDate: "2026-05-28", daysLeft: 13 },
  { courseId: "c3", courseName: "Eğitim Bilimleri", examDate: "2026-05-30", daysLeft: 15 },
];

const difficultyLabels = { easy: "Kolay", medium: "Orta", hard: "Zor" };
const difficultyColor = {
  easy: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  medium: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function StudyPage() {
  const [selectedCourse, setSelectedCourse] = React.useState<string>("c1");
  const [topics, setTopics] = React.useState<StudyTopic[]>(mockStudyTopics);
  const [newTopicTitle, setNewTopicTitle] = React.useState("");
  const [newTopicDifficulty, setNewTopicDifficulty] = React.useState<"easy" | "medium" | "hard">("medium");
  const [newTopicDuration, setNewTopicDuration] = React.useState("60");

  const courseTopics = topics.filter((t) => t.courseId === selectedCourse);
  const completedCount = courseTopics.filter((t) => t.completed).length;
  const totalMinutes = courseTopics.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const remainingMinutes = courseTopics
    .filter((t) => !t.completed)
    .reduce((acc, t) => acc + t.estimatedMinutes, 0);

  const exam = mockExams.find((e) => e.courseId === selectedCourse);
  const course = mockCourses.find((c) => c.id === selectedCourse);

  function toggleTopic(topicId: string) {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function addTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    const newTopic: StudyTopic = {
      id: `st-${Date.now()}`,
      courseId: selectedCourse,
      title: newTopicTitle,
      difficulty: newTopicDifficulty,
      estimatedMinutes: parseInt(newTopicDuration) || 60,
      completed: false,
    };
    setTopics((prev) => [...prev, newTopic]);
    setNewTopicTitle("");
    setNewTopicDuration("60");
  }

  // Generate suggested study plan
  const remainingTopics = courseTopics.filter((t) => !t.completed);
  const studyDays = exam ? Math.max(exam.daysLeft - 2, 1) : 7;
  const revisionDays = exam ? Math.min(2, exam.daysLeft) : 0;
  const dailyMinutes = studyDays > 0 ? Math.ceil(remainingMinutes / studyDays) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Ders Çalışma Asistanı
        </h1>
        <p className="mt-1 text-muted-foreground">
          Sınavlarına göre çalışma planı oluştur ve ilerlemeni takip et.
        </p>
      </div>

      {/* Course selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Label>Ders Seçin</Label>
          <Select value={selectedCourse} onValueChange={(v) => v && setSelectedCourse(v)}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {mockCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {exam && (
          <Badge
            variant={exam.daysLeft <= 5 ? "destructive" : "secondary"}
            className="h-fit w-fit text-sm"
          >
            <AlertTriangle className="mr-1 h-3.5 w-3.5" />
            Sınava {exam.daysLeft} gün
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Toplam Konu</p>
              <p className="text-lg font-bold">{courseTopics.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-3">
            <CheckCircle2 className="h-4 w-4 text-chart-3" />
            <div>
              <p className="text-xs text-muted-foreground">Tamamlanan</p>
              <p className="text-lg font-bold">
                {completedCount}/{courseTopics.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-3">
            <Clock className="h-4 w-4 text-chart-4" />
            <div>
              <p className="text-xs text-muted-foreground">Kalan Süre</p>
              <p className="text-lg font-bold">
                {Math.floor(remainingMinutes / 60)} sa {remainingMinutes % 60} dk
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">İlerleme</p>
              <p className="text-lg font-bold">
                %{courseTopics.length > 0 ? Math.round((completedCount / courseTopics.length) * 100) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Topic list */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Konu Listesi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {courseTopics.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Henüz konu eklenmemiş. Aşağıdan yeni konu ekleyin.
                </p>
              ) : (
                courseTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-all ${
                      topic.completed ? "opacity-60" : ""
                    }`}
                  >
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className="shrink-0"
                      aria-label={
                        topic.completed ? "Tamamlanmadı olarak işaretle" : "Tamamlandı olarak işaretle"
                      }
                    >
                      {topic.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-chart-3" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          topic.completed ? "line-through" : ""
                        }`}
                      >
                        {topic.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {topic.estimatedMinutes} dk
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${difficultyColor[topic.difficulty]}`}
                    >
                      {difficultyLabels[topic.difficulty]}
                    </Badge>
                  </div>
                ))
              )}

              <Separator className="my-3" />

              {/* Add new topic form */}
              <form onSubmit={addTopic} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="new-topic" className="text-xs">Yeni Konu</Label>
                  <Input
                    id="new-topic"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="Konu adı"
                    className="h-8"
                  />
                </div>
                <div className="w-24 space-y-1">
                  <Label className="text-xs">Süre</Label>
                  <Input
                    type="number"
                    min="15"
                    step="15"
                    value={newTopicDuration}
                    onChange={(e) => setNewTopicDuration(e.target.value)}
                    className="h-8"
                  />
                </div>
                <Select value={newTopicDifficulty} onValueChange={(v) => setNewTopicDifficulty(v as "easy" | "medium" | "hard")}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="easy">Kolay</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="hard">Zor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button type="submit" size="sm" className="gap-1 h-8">
                  <Plus className="h-3.5 w-3.5" />
                  Ekle
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Study plan suggestion */}
        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="h-5 w-5 text-primary" />
                Çalışma Planı Önerisi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {exam && remainingTopics.length > 0 ? (
                <>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{course?.name}</span>{" "}
                    final sınavına{" "}
                    <span className="font-medium text-foreground">{exam.daysLeft} gün</span>{" "}
                    kaldı. {remainingTopics.length} konu için {studyDays} günlük
                    çalışma ve {revisionDays} günlük tekrar planı öneriyorum.
                  </p>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium">Günlük Hedef:</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>~{dailyMinutes} dakika / gün</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium">Öncelik Sırası:</p>
                    {remainingTopics
                      .sort((a, b) => {
                        const order = { hard: 0, medium: 1, easy: 2 };
                        return order[a.difficulty] - order[b.difficulty];
                      })
                      .map((topic, i) => (
                        <div
                          key={topic.id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-[10px]">
                            {i + 1}
                          </span>
                          <span className="flex-1 truncate">{topic.title}</span>
                          <span className="text-muted-foreground">{topic.estimatedMinutes} dk</span>
                        </div>
                      ))}
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Son {revisionDays} gün tekrar için ayrıldı
                  </div>
                </>
              ) : remainingTopics.length === 0 && courseTopics.length > 0 ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <CheckCircle2 className="h-8 w-8 text-chart-3" />
                  <p className="font-medium text-chart-3">
                    Tüm konular tamamlandı! 🎉
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    Sınav öncesi tekrar yapmayı unutma.
                  </p>
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  Konuları ekledikten sonra çalışma planı önerisi burada
                  görünecek.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
