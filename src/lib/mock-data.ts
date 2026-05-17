// Mock data for Zaman Pusulası dashboard — all Turkish UI copy
// This will be replaced by Supabase queries later.

export type TaskType = "lesson" | "exam" | "assignment" | "event" | "personal" | "study";
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "planned" | "in_progress" | "completed" | "postponed" | "cancelled";

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  courseName?: string;
  startTime?: string;
  endTime?: string;
  deadline?: string;
  estimatedDuration?: number; // minutes
  prepDuration?: number; // minutes
  travelDuration?: number; // minutes
  location?: string;
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  color: string;
}

export interface StudyTopic {
  id: string;
  courseId: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  completed: boolean;
}

// Mock courses
export const mockCourses: Course[] = [
  { id: "c1", name: "Matematik", instructor: "Dr. Ayşe Yılmaz", color: "#6366f1" },
  { id: "c2", name: "Fizik", instructor: "Dr. Mehmet Kaya", color: "#8b5cf6" },
  { id: "c3", name: "Eğitim Bilimleri", instructor: "Dr. Zeynep Demir", color: "#06b6d4" },
  { id: "c4", name: "Türk Dili", instructor: "Dr. Ali Öztürk", color: "#10b981" },
];

// Mock tasks for today
export const mockTodayTasks: Task[] = [
  {
    id: "t1",
    title: "Matematik Dersi",
    type: "lesson",
    priority: "high",
    status: "planned",
    courseName: "Matematik",
    startTime: "09:00",
    endTime: "10:30",
    prepDuration: 15,
    travelDuration: 25,
    location: "Kampüs A Blok",
  },
  {
    id: "t2",
    title: "Fizik Lab Raporu",
    description: "Deney 5 raporu teslimi",
    type: "assignment",
    priority: "high",
    status: "in_progress",
    courseName: "Fizik",
    deadline: "2026-05-06T23:59:00",
    estimatedDuration: 90,
  },
  {
    id: "t3",
    title: "Lineer Cebir Çalışması",
    type: "study",
    priority: "medium",
    status: "planned",
    courseName: "Matematik",
    estimatedDuration: 45,
  },
  {
    id: "t4",
    title: "Eğitim Bilimleri Vize",
    type: "exam",
    priority: "high",
    status: "planned",
    courseName: "Eğitim Bilimleri",
    startTime: "14:00",
    endTime: "15:30",
    prepDuration: 20,
    travelDuration: 30,
    location: "Kampüs B Blok",
  },
  {
    id: "t5",
    title: "Kulüp Toplantısı",
    type: "event",
    priority: "low",
    status: "planned",
    startTime: "17:00",
    endTime: "18:00",
    location: "Öğrenci Merkezi",
    travelDuration: 10,
  },
];

// Mock upcoming deadlines
export const mockUpcoming: Task[] = [
  {
    id: "u1",
    title: "Türk Dili Ödevi",
    type: "assignment",
    priority: "medium",
    status: "planned",
    courseName: "Türk Dili",
    deadline: "2026-05-08T23:59:00",
    estimatedDuration: 120,
  },
  {
    id: "u2",
    title: "Matematik Final Sınavı",
    type: "exam",
    priority: "high",
    status: "planned",
    courseName: "Matematik",
    deadline: "2026-05-15T10:00:00",
  },
  {
    id: "u3",
    title: "Fizik Final Sınavı",
    type: "exam",
    priority: "high",
    status: "planned",
    courseName: "Fizik",
    deadline: "2026-05-18T14:00:00",
  },
];

// Weekly stats
export const mockWeeklyStats = {
  plannedTasks: 18,
  completedTasks: 12,
  completionPercentage: 67,
  studyTimeMinutes: 480,
  postponedTasks: 3,
};

// Helper labels for Turkish display
export const taskTypeLabels: Record<TaskType, string> = {
  lesson: "Ders",
  exam: "Sınav",
  assignment: "Ödev",
  event: "Etkinlik",
  personal: "Kişisel",
  study: "Çalışma",
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  planned: "Planlandı",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  postponed: "Ertelendi",
  cancelled: "İptal Edildi",
};
