/**
 * Zaman Pusulası — Data Access Layer
 *
 * CRUD functions that abstract Supabase queries.
 * When Supabase is not configured, they fall back to mock data.
 * This makes the app fully functional in development without a DB.
 */

import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";
import {
  type Task,
  type TaskType,
  type TaskPriority,
  type TaskStatus,
  type Course,
  type StudyTopic,
  mockTodayTasks,
  mockUpcoming,
  mockCourses,
  mockWeeklyStats,
} from "@/lib/mock-data";

// ─── Row types from DB ─────────────────────────────────
type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type StudyTopicRow = Database["public"]["Tables"]["study_topics"]["Row"];

// ─── Helpers ────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function mapTaskRow(row: TaskRow & { course_name?: string }): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    type: row.type as TaskType,
    priority: row.priority as TaskPriority,
    status: row.status as TaskStatus,
    courseName: row.course_name,
    startTime: row.start_time
      ? new Date(row.start_time).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : undefined,
    endTime: row.end_time
      ? new Date(row.end_time).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : undefined,
    deadline: row.deadline ?? undefined,
    estimatedDuration: row.estimated_duration ?? undefined,
    prepDuration: row.prep_duration ?? undefined,
    travelDuration: row.travel_duration ?? undefined,
    location: undefined,
  };
}

function mapCourseRow(row: CourseRow): Course {
  return {
    id: row.id,
    name: row.name,
    instructor: row.instructor ?? "",
    color: row.color,
  };
}

function mapStudyTopicRow(row: StudyTopicRow): StudyTopic {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    difficulty: row.difficulty as "easy" | "medium" | "hard",
    estimatedMinutes: row.estimated_minutes,
    completed: row.completed,
  };
}

// ─── TASKS ──────────────────────────────────────────────

export async function getTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured()) {
    return [...mockTodayTasks, ...mockUpcoming];
  }

  const supabase = createClient();
  if (!supabase) return [...mockTodayTasks, ...mockUpcoming];
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("deadline", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching tasks:", error);
    return [...mockTodayTasks, ...mockUpcoming];
  }

  return (data as TaskRow[]).map((row) => mapTaskRow(row));
}

export async function getTodayTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured()) {
    return mockTodayTasks;
  }

  const supabase = createClient();
  if (!supabase) return mockTodayTasks;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .gte("start_time", today.toISOString())
    .lt("start_time", tomorrow.toISOString())
    .order("start_time", { ascending: true });

  if (error || !data) {
    console.error("Error fetching today tasks:", error);
    return mockTodayTasks;
  }

  return (data as TaskRow[]).map((row) => mapTaskRow(row));
}

export async function createTask(
  task: Partial<Task> & { courseId?: string }
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log("[mock] Task created:", task);
    return { success: true };
  }

  const supabase = createClient();
  if (!supabase) return { success: false, error: "Supabase yapılandırılmamış." };
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Oturum açmanız gerekiyor." };

  const insertData: Database["public"]["Tables"]["tasks"]["Insert"] = {
    user_id: user.id,
    title: task.title!,
    description: task.description,
    type: task.type ?? "personal",
    priority: task.priority ?? "medium",
    status: task.status ?? "planned",
    course_id: task.courseId,
    start_time: task.startTime
      ? new Date(`1970-01-01T${task.startTime}:00`).toISOString()
      : null,
    end_time: task.endTime
      ? new Date(`1970-01-01T${task.endTime}:00`).toISOString()
      : null,
    deadline: task.deadline,
    estimated_duration: task.estimatedDuration,
    prep_duration: task.prepDuration,
    travel_duration: task.travelDuration,
  };

  const { error } = await supabase.from("tasks").insert(insertData as never);

  if (error) {
    console.error("Error creating task:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log("[mock] Task status updated:", taskId, status);
    return { success: true };
  }

  const supabase = createClient();
  if (!supabase) return { success: false, error: "Supabase yapılandırılmamış." };
  const { error } = await supabase
    .from("tasks")
    .update({ status } as never)
    .eq("id", taskId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteTask(
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log("[mock] Task deleted:", taskId);
    return { success: true };
  }

  const supabase = createClient();
  if (!supabase) return { success: false, error: "Supabase yapılandırılmamış." };
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── COURSES ────────────────────────────────────────────

export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) {
    return mockCourses;
  }

  const supabase = createClient();
  if (!supabase) return mockCourses;
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Error fetching courses:", error);
    return mockCourses;
  }

  return (data as CourseRow[]).map((row) => mapCourseRow(row));
}

export async function createCourse(
  course: Omit<Course, "id">
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log("[mock] Course created:", course);
    return { success: true };
  }

  const supabase = createClient();
  if (!supabase) return { success: false, error: "Supabase yapılandırılmamış." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Oturum açmanız gerekiyor." };

  const insertData: Database["public"]["Tables"]["courses"]["Insert"] = {
    user_id: user.id,
    name: course.name,
    instructor: course.instructor,
    color: course.color,
  };

  const { error } = await supabase.from("courses").insert(insertData as never);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── STUDY TOPICS ───────────────────────────────────────

export async function getStudyTopics(
  courseId: string
): Promise<StudyTopic[]> {
  if (!isSupabaseConfigured()) {
    return []; // Mock study topics are local in the study page
  }

  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("study_topics")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("Error fetching study topics:", error);
    return [];
  }

  return (data as StudyTopicRow[]).map((row) => mapStudyTopicRow(row));
}

export async function toggleStudyTopic(
  topicId: string,
  completed: boolean
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    console.log("[mock] Topic toggled:", topicId, completed);
    return { success: true };
  }

  const supabase = createClient();
  if (!supabase) return { success: false };
  const { error } = await supabase
    .from("study_topics")
    .update({ completed } as never)
    .eq("id", topicId);

  return { success: !error };
}

// ─── STATS ──────────────────────────────────────────────

interface StatsRow {
  status: string;
  estimated_duration: number | null;
}

export async function getWeeklyStats() {
  if (!isSupabaseConfigured()) {
    return mockWeeklyStats;
  }

  const supabase = createClient();
  if (!supabase) return mockWeeklyStats;
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("tasks")
    .select("status, estimated_duration")
    .gte("created_at", weekAgo.toISOString());

  if (error || !data) return mockWeeklyStats;

  const rows = data as StatsRow[];
  const planned = rows.length;
  const completed = rows.filter((t) => t.status === "completed").length;
  const postponed = rows.filter((t) => t.status === "postponed").length;
  const studyTime = rows
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + (t.estimated_duration ?? 0), 0);

  return {
    plannedTasks: planned,
    completedTasks: completed,
    completionPercentage:
      planned > 0 ? Math.round((completed / planned) * 100) : 0,
    studyTimeMinutes: studyTime,
    postponedTasks: postponed,
  };
}

// ─── USER PROFILE ───────────────────────────────────────

export async function getUserProfile() {
  if (!isSupabaseConfigured()) {
    return {
      name: "Elif Yılmaz",
      email: "elif@ogrenci.edu.tr",
      educationLevel: "university",
    };
  }

  const supabase = createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}
