"use client";

import * as React from "react";
import {
  ListTodo,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Loader2,
  PauseCircle,
  XCircle,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import {
  type Task,
  type TaskStatus,
  type TaskType,
  mockTodayTasks,
  mockUpcoming,
  taskTypeLabels,
  taskPriorityLabels,
  taskStatusLabels,
} from "@/lib/mock-data";

const statusIcon: Record<TaskStatus, React.ReactNode> = {
  planned: <Circle className="h-4 w-4 text-muted-foreground" />,
  in_progress: <Loader2 className="h-4 w-4 text-primary" />,
  completed: <CheckCircle2 className="h-4 w-4 text-chart-3" />,
  postponed: <PauseCircle className="h-4 w-4 text-chart-4" />,
  cancelled: <XCircle className="h-4 w-4 text-destructive" />,
};

const typeColor: Record<TaskType, string> = {
  lesson: "bg-primary/10 text-primary border-primary/20",
  exam: "bg-destructive/10 text-destructive border-destructive/20",
  assignment: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  event: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  personal: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  study: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

const statusTransitions: Record<TaskStatus, { next: TaskStatus; label: string }> = {
  planned: { next: "in_progress", label: "Başla" },
  in_progress: { next: "completed", label: "Tamamla" },
  completed: { next: "planned", label: "Tekrar Planla" },
  postponed: { next: "planned", label: "Tekrar Planla" },
  cancelled: { next: "planned", label: "Tekrar Planla" },
};

function TaskCard({
  task,
  onStatusChange,
  onDelete,
  onEdit,
}: {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) {
  const transition = statusTransitions[task.status];

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
      {/* Status icon — clickable for quick transition */}
      <button
        className="pt-0.5 transition-transform hover:scale-110"
        onClick={() => onStatusChange(task.id, transition.next)}
        title={transition.label}
        aria-label={`${task.title} — ${transition.label}`}
      >
        {statusIcon[task.status]}
      </button>

      {/* Content */}
      <div className="flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`font-medium ${
              task.status === "completed" ? "line-through opacity-60" : ""
            }`}
          >
            {task.title}
          </p>
          <Badge
            variant="outline"
            className={`text-[10px] font-medium ${typeColor[task.type]}`}
          >
            {taskTypeLabels[task.type]}
          </Badge>
          {task.priority === "high" && (
            <Badge variant="destructive" className="text-[10px]">
              {taskPriorityLabels[task.priority]}
            </Badge>
          )}
          {task.priority === "medium" && (
            <Badge variant="secondary" className="text-[10px]">
              {taskPriorityLabels[task.priority]}
            </Badge>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}

        {task.courseName && (
          <p className="text-xs font-medium text-primary">{task.courseName}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {task.startTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.startTime}
              {task.endTime && ` – ${task.endTime}`}
            </span>
          )}
          {task.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {task.location}
            </span>
          )}
          {task.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.estimatedDuration} dk
            </span>
          )}
          {task.prepDuration && (
            <span>Hazırlık: {task.prepDuration} dk</span>
          )}
          {task.travelDuration && <span>Yol: {task.travelDuration} dk</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Quick status transition button */}
        {task.status !== "completed" && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden gap-1 text-xs sm:flex opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onStatusChange(task.id, transition.next)}
          >
            {transition.label}
            <ArrowRight className="h-3 w-3" />
          </Button>
        )}

        {/* Status badge */}
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {taskStatusLabels[task.status]}
        </Badge>

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Görev seçenekleri"
              />
            }
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs">
              İşlemler
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-xs"
              onClick={() => onEdit(task)}
            >
              <Edit2 className="h-3.5 w-3.5" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-xs"
              onClick={() =>
                onStatusChange(task.id, "postponed")
              }
            >
              <PauseCircle className="h-3.5 w-3.5" />
              Ertele
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-xs text-destructive focus:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([
    ...mockTodayTasks,
    ...mockUpcoming,
  ]);
  const [filterType, setFilterType] = React.useState<string>("all");
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const filteredTasks =
    filterType === "all"
      ? tasks
      : tasks.filter((t) => t.type === filterType);

  const taskTypes: { value: string; label: string }[] = [
    { value: "all", label: "Tümü" },
    ...Object.entries(taskTypeLabels).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  function handleAddTask(task: Partial<Task>) {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: task.title ?? "Yeni Görev",
      description: task.description,
      type: task.type ?? "personal",
      priority: task.priority ?? "medium",
      status: task.status ?? "planned",
      courseName: task.courseName,
      startTime: task.startTime,
      endTime: task.endTime,
      estimatedDuration: task.estimatedDuration,
      prepDuration: task.prepDuration,
      travelDuration: task.travelDuration,
      location: task.location,
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleStatusChange(id: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
  }

  // Stats from current state
  const planned = tasks.filter((t) => t.status === "planned").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Görevler</h1>
          <p className="mt-1 text-muted-foreground">
            Derslerini, sınavlarını, ödevlerini ve etkinliklerini yönet.
          </p>
        </div>
        <TaskFormDialog onSubmit={handleAddTask} editTask={editingTask} />
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-3">
            <ListTodo className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Toplam</p>
              <p className="text-lg font-bold">{tasks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-3">
            <Circle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Planlandı</p>
              <p className="text-lg font-bold">{planned}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-3">
            <Loader2 className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Devam Eden</p>
              <p className="text-lg font-bold">{inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-3">
            <CheckCircle2 className="h-4 w-4 text-chart-3" />
            <div>
              <p className="text-xs text-muted-foreground">Tamamlandı</p>
              <p className="text-lg font-bold">{completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Filtrele:
          </span>
        </div>
        <Tabs value={filterType} onValueChange={setFilterType}>
          <TabsList>
            {taskTypes.map((tt) => (
              <TabsTrigger key={tt.value} value={tt.value}>
                {tt.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={filterType} className="mt-4">
            {filteredTasks.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ListTodo className="mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Bu kategoride görev bulunamadı.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
