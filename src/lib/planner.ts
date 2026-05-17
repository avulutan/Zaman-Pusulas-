/**
 * Zaman Pusulası — Basic Planning Engine
 *
 * Pure TypeScript utility functions for deterministic planning logic.
 * No LLM involved — this handles sorting, overlap detection, time-block
 * estimation, and basic rescheduling suggestions.
 */

import type { Task, TaskPriority } from "@/lib/mock-data";

// ─── Types ──────────────────────────────────────────────────────────

export interface TimeBlock {
  start: number; // minutes from midnight (e.g., 540 = 09:00)
  end: number;
  taskId?: string;
  type: "task" | "prep" | "travel" | "break" | "free";
  label: string;
}

export interface DailyPlan {
  date: string; // ISO date string (yyyy-mm-dd)
  blocks: TimeBlock[];
  conflicts: Conflict[];
  overloaded: boolean;
}

export interface Conflict {
  taskA: Task;
  taskB: Task;
  overlapMinutes: number;
}

export interface RescheduleSuggestion {
  taskToMove: Task;
  reason: string;
  suggestedAction: "postpone" | "shorten" | "move";
}

// ─── Helpers ────────────────────────────────────────────────────────

/** Parse "HH:MM" to minutes from midnight */
export function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Format minutes from midnight to "HH:MM" */
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Priority weight for sorting (higher = more urgent) */
const priorityWeight: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

// ─── Core Functions ─────────────────────────────────────────────────

/**
 * Sort tasks by deadline (nearest first) then by priority (highest first).
 */
export function sortByDeadlineAndPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Tasks with deadlines come first
    if (a.deadline && !b.deadline) return -1;
    if (!a.deadline && b.deadline) return 1;

    // Compare deadlines
    if (a.deadline && b.deadline) {
      const diff = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (diff !== 0) return diff;
    }

    // Compare start times
    if (a.startTime && b.startTime) {
      const diff = parseTime(a.startTime) - parseTime(b.startTime);
      if (diff !== 0) return diff;
    }

    // Compare priorities
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });
}

/**
 * Calculate the effective start time for a task including prep and travel.
 * Returns minutes from midnight.
 */
export function getEffectiveStartTime(task: Task): number | null {
  if (!task.startTime) return null;
  const taskStart = parseTime(task.startTime);
  const prep = task.prepDuration ?? 0;
  const travel = task.travelDuration ?? 0;
  return taskStart - prep - travel;
}

/**
 * Calculate the departure time suggestion.
 * Returns a formatted string like "14:05'te hazırlanmaya başla, 14:25'te yola çık"
 */
export function getDepartureAdvice(task: Task): string | null {
  if (!task.startTime) return null;
  const taskStart = parseTime(task.startTime);
  const prep = task.prepDuration ?? 0;
  const travel = task.travelDuration ?? 0;

  if (prep === 0 && travel === 0) return null;

  const prepStartMin = taskStart - prep - travel;
  const departMin = taskStart - travel;

  const parts: string[] = [];
  if (prep > 0) {
    parts.push(`${formatTime(prepStartMin)}'de hazırlanmaya başla`);
  }
  if (travel > 0) {
    parts.push(`${formatTime(departMin)}'de yola çık`);
  }

  return parts.join(", ");
}

/**
 * Detect overlapping tasks.
 * Only checks tasks that have explicit start/end times.
 */
export function detectConflicts(tasks: Task[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const timedTasks = tasks.filter((t) => t.startTime && t.endTime);

  for (let i = 0; i < timedTasks.length; i++) {
    for (let j = i + 1; j < timedTasks.length; j++) {
      const a = timedTasks[i];
      const b = timedTasks[j];

      // Include prep and travel time in the check
      const aStart = getEffectiveStartTime(a) ?? parseTime(a.startTime!);
      const aEnd = parseTime(a.endTime!);
      const bStart = getEffectiveStartTime(b) ?? parseTime(b.startTime!);
      const bEnd = parseTime(b.endTime!);

      // Check overlap
      if (aStart < bEnd && bStart < aEnd) {
        const overlapStart = Math.max(aStart, bStart);
        const overlapEnd = Math.min(aEnd, bEnd);
        conflicts.push({
          taskA: a,
          taskB: b,
          overlapMinutes: overlapEnd - overlapStart,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Estimate available free time blocks in a day.
 * dayStart/dayEnd in minutes from midnight (defaults: 07:00–22:00).
 */
export function estimateFreeBlocks(
  tasks: Task[],
  dayStart = 420, // 07:00
  dayEnd = 1320 // 22:00
): TimeBlock[] {
  // Get all occupied time ranges
  const occupied: { start: number; end: number; taskId: string }[] = [];

  for (const task of tasks) {
    if (task.startTime && task.endTime) {
      const effectiveStart =
        getEffectiveStartTime(task) ?? parseTime(task.startTime);
      const end = parseTime(task.endTime);
      occupied.push({ start: effectiveStart, end, taskId: task.id });
    }
  }

  // Sort by start time
  occupied.sort((a, b) => a.start - b.start);

  // Find gaps
  const freeBlocks: TimeBlock[] = [];
  let cursor = dayStart;

  for (const slot of occupied) {
    if (cursor < slot.start) {
      freeBlocks.push({
        start: cursor,
        end: slot.start,
        type: "free",
        label: `${formatTime(cursor)} – ${formatTime(slot.start)}`,
      });
    }
    cursor = Math.max(cursor, slot.end);
  }

  // Remaining time after last task
  if (cursor < dayEnd) {
    freeBlocks.push({
      start: cursor,
      end: dayEnd,
      type: "free",
      label: `${formatTime(cursor)} – ${formatTime(dayEnd)}`,
    });
  }

  return freeBlocks;
}

/**
 * Check if a day is overloaded and suggest which tasks to move.
 * A day is "overloaded" if total estimated duration exceeds available time.
 */
export function getOverloadSuggestions(
  tasks: Task[],
  dayStart = 420,
  dayEnd = 1320
): RescheduleSuggestion[] {
  const totalAvailable = dayEnd - dayStart;

  // Calculate total scheduled time
  let totalScheduled = 0;
  for (const task of tasks) {
    if (task.startTime && task.endTime) {
      totalScheduled += parseTime(task.endTime) - parseTime(task.startTime);
      totalScheduled += task.prepDuration ?? 0;
      totalScheduled += task.travelDuration ?? 0;
    } else if (task.estimatedDuration) {
      totalScheduled += task.estimatedDuration;
    }
  }

  if (totalScheduled <= totalAvailable) return [];

  // Suggest moving lower-priority, flexible tasks
  const suggestions: RescheduleSuggestion[] = [];
  const sorted = sortByDeadlineAndPriority(tasks);

  // Work backwards (lowest priority first)
  for (let i = sorted.length - 1; i >= 0; i--) {
    const task = sorted[i];
    if (totalScheduled <= totalAvailable) break;

    // Only suggest moving flexible tasks (no fixed start time) or low priority
    if (!task.startTime || task.priority === "low") {
      const duration = task.estimatedDuration ?? 60;
      suggestions.push({
        taskToMove: task,
        reason:
          task.priority === "low"
            ? `"${task.title}" düşük öncelikli — yarına ertelenebilir`
            : `"${task.title}" esnek zamanlı — başka güne taşınabilir`,
        suggestedAction: "postpone",
      });
      totalScheduled -= duration;
    }
  }

  return suggestions;
}

/**
 * Add break time suggestion after long study sessions.
 * If a study session is > breakThreshold minutes, insert a break after it.
 */
export function suggestBreaks(
  tasks: Task[],
  breakDuration = 10,
  breakThreshold = 50
): TimeBlock[] {
  const breaks: TimeBlock[] = [];

  for (const task of tasks) {
    if (
      (task.type === "study" || task.type === "lesson") &&
      task.endTime
    ) {
      const duration = task.estimatedDuration ??
        (task.startTime && task.endTime
          ? parseTime(task.endTime) - parseTime(task.startTime)
          : 0);

      if (duration >= breakThreshold) {
        const endMin = parseTime(task.endTime);
        breaks.push({
          start: endMin,
          end: endMin + breakDuration,
          taskId: task.id,
          type: "break",
          label: `Mola (${task.title} sonrası)`,
        });
      }
    }
  }

  return breaks;
}

/**
 * Build a complete daily plan from a list of tasks.
 */
export function buildDailyPlan(
  tasks: Task[],
  date: string,
  dayStart = 420,
  dayEnd = 1320
): DailyPlan {
  const sorted = sortByDeadlineAndPriority(tasks);
  const conflicts = detectConflicts(sorted);
  const freeBlocks = estimateFreeBlocks(sorted, dayStart, dayEnd);
  const breaks = suggestBreaks(sorted);
  const overloadSuggestions = getOverloadSuggestions(sorted, dayStart, dayEnd);

  // Build time blocks
  const blocks: TimeBlock[] = [];

  for (const task of sorted) {
    if (task.startTime && task.endTime) {
      const effectiveStart = getEffectiveStartTime(task);
      const taskStart = parseTime(task.startTime);
      const taskEnd = parseTime(task.endTime);

      // Add prep block
      if (task.prepDuration && effectiveStart !== null) {
        const travelStart = taskStart - (task.travelDuration ?? 0);
        blocks.push({
          start: effectiveStart,
          end: travelStart,
          taskId: task.id,
          type: "prep",
          label: `Hazırlık: ${task.title}`,
        });
      }

      // Add travel block
      if (task.travelDuration) {
        const travelStart = taskStart - task.travelDuration;
        blocks.push({
          start: travelStart,
          end: taskStart,
          taskId: task.id,
          type: "travel",
          label: `Yol: ${task.title}`,
        });
      }

      // Add task block
      blocks.push({
        start: taskStart,
        end: taskEnd,
        taskId: task.id,
        type: "task",
        label: task.title,
      });
    }
  }

  // Add breaks
  blocks.push(...breaks);

  // Add free blocks
  blocks.push(...freeBlocks);

  // Sort all blocks by start time
  blocks.sort((a, b) => a.start - b.start);

  return {
    date,
    blocks,
    conflicts,
    overloaded: overloadSuggestions.length > 0,
  };
}
