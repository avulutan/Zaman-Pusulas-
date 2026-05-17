"use client";

import * as React from "react";
import {
  Plus,
  Clock,
  MapPin,
  CalendarDays,
  BookOpen,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type TaskType,
  type TaskPriority,
  type Task,
  taskTypeLabels,
  taskPriorityLabels,
  mockCourses,
} from "@/lib/mock-data";

interface TaskFormDialogProps {
  trigger?: React.ReactNode;
  onSubmit?: (task: Partial<Task>) => void;
  editTask?: Task | null;
}

const taskTypeOptions: { value: TaskType; label: string }[] = [
  { value: "lesson", label: taskTypeLabels.lesson },
  { value: "exam", label: taskTypeLabels.exam },
  { value: "assignment", label: taskTypeLabels.assignment },
  { value: "event", label: taskTypeLabels.event },
  { value: "personal", label: taskTypeLabels.personal },
  { value: "study", label: taskTypeLabels.study },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "low", label: taskPriorityLabels.low },
  { value: "medium", label: taskPriorityLabels.medium },
  { value: "high", label: taskPriorityLabels.high },
];

export function TaskFormDialog({
  trigger,
  onSubmit,
  editTask,
}: TaskFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(editTask?.title ?? "");
  const [description, setDescription] = React.useState(editTask?.description ?? "");
  const [type, setType] = React.useState<TaskType>(editTask?.type ?? "personal");
  const [priority, setPriority] = React.useState<TaskPriority>(editTask?.priority ?? "medium");
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState(editTask?.startTime ?? "");
  const [endTime, setEndTime] = React.useState(editTask?.endTime ?? "");
  const [estimatedDuration, setEstimatedDuration] = React.useState(
    editTask?.estimatedDuration?.toString() ?? ""
  );
  const [prepDuration, setPrepDuration] = React.useState(
    editTask?.prepDuration?.toString() ?? ""
  );
  const [travelDuration, setTravelDuration] = React.useState(
    editTask?.travelDuration?.toString() ?? ""
  );
  const [location, setLocation] = React.useState(editTask?.location ?? "");
  const [courseId, setCourseId] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const course = mockCourses.find((c) => c.id === courseId);
    const task: Partial<Task> = {
      title,
      description: description || undefined,
      type,
      priority,
      status: "planned",
      courseName: course?.name,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      deadline: date ? `${date}T${endTime || "23:59"}:00` : undefined,
      estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
      prepDuration: prepDuration ? parseInt(prepDuration) : undefined,
      travelDuration: travelDuration ? parseInt(travelDuration) : undefined,
      location: location || undefined,
    };
    onSubmit?.(task);
    setOpen(false);
    resetForm();
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setType("personal");
    setPriority("medium");
    setDate("");
    setStartTime("");
    setEndTime("");
    setEstimatedDuration("");
    setPrepDuration("");
    setTravelDuration("");
    setLocation("");
    setCourseId("");
  }

  // Auto-open and pre-fill when editTask changes
  React.useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description ?? "");
      setType(editTask.type);
      setPriority(editTask.priority);
      setStartTime(editTask.startTime ?? "");
      setEndTime(editTask.endTime ?? "");
      setEstimatedDuration(editTask.estimatedDuration?.toString() ?? "");
      setPrepDuration(editTask.prepDuration?.toString() ?? "");
      setTravelDuration(editTask.travelDuration?.toString() ?? "");
      setLocation(editTask.location ?? "");
      setOpen(true);
    }
  }, [editTask]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (
            <>{trigger}</>
          ) : (
            <Button className="gap-2" id="add-task-btn">
              <Plus className="h-4 w-4" />
              Yeni Görev
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editTask ? "Görevi Düzenle" : "Yeni Görev Ekle"}
          </DialogTitle>
          <DialogDescription>
            Görev bilgilerini doldur. Hazırlık ve yol süresi opsiyoneldir.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" id="task-form">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title">Başlık *</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Görev başlığı"
              required
            />
          </div>

          {/* Type & Priority row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
                Tür
              </Label>
              <Select value={type} onValueChange={(val) => setType(val as TaskType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {taskTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                <Flag className="mr-1 inline h-3.5 w-3.5" />
                Öncelik
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as TaskPriority)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Öncelik seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {priorityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label>
              <BookOpen className="mr-1 inline h-3.5 w-3.5" />
              Bağlı Ders
            </Label>
            <Select value={courseId} onValueChange={(v) => setCourseId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ders seçin (opsiyonel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {mockCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="task-date">Tarih</Label>
              <Input
                id="task-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-start">Başlangıç</Label>
              <Input
                id="task-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-end">Bitiş</Label>
              <Input
                id="task-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Duration row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="task-duration">
                <Clock className="mr-1 inline h-3.5 w-3.5" />
                Süre (dk)
              </Label>
              <Input
                id="task-duration"
                type="number"
                min="0"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="45"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-prep">Hazırlık (dk)</Label>
              <Input
                id="task-prep"
                type="number"
                min="0"
                value={prepDuration}
                onChange={(e) => setPrepDuration(e.target.value)}
                placeholder="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-travel">Yol (dk)</Label>
              <Input
                id="task-travel"
                type="number"
                min="0"
                value={travelDuration}
                onChange={(e) => setTravelDuration(e.target.value)}
                placeholder="25"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="task-location">
              <MapPin className="mr-1 inline h-3.5 w-3.5" />
              Konum
            </Label>
            <Input
              id="task-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Kampüs, kütüphane, ev..."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-desc">Açıklama</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ek notlar (opsiyonel)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="gap-2">
              {editTask ? "Kaydet" : "Görev Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
