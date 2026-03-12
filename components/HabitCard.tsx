"use client";

import { useState, useRef } from "react";
import { Flame, Trash2, Check } from "lucide-react";
import type { Habit, HabitLog } from "@/types";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

interface Props {
  habit: Habit;
  logs: HabitLog[];
  weekDates: string[];
  today: string;
  onToggleComplete: (habitId: string, currentlyCompleted: boolean) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
}

export default function HabitCard({
  habit,
  logs,
  weekDates,
  today,
  onToggleComplete,
  onDelete,
}: Props) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [streakAnimating, setStreakAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const completedToday = logs.some((l) => l.date === today && l.completed);

  // Build weekly completion booleans
  const weeklyCompletion = weekDates.map((date) =>
    logs.some((l) => l.date === date && l.completed)
  );

  async function handleToggle() {
    if (toggling) return;
    setToggling(true);

    const wasCompleted = completedToday;
    await onToggleComplete(habit.id, wasCompleted);

    if (!wasCompleted) {
      // Completing — animate streak and fire confetti
      setStreakAnimating(true);
      setTimeout(() => setStreakAnimating(false), 600);

      // Small confetti burst from button position
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: ["#62825c", "#adc0a8", "#d1dccf", "#cba862"],
          scalar: 0.8,
        });
      }
    }

    setToggling(false);
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    await onDelete(habit.id);
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group",
        completedToday && "ring-1 ring-sage-200"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Habit name + streak */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-body font-medium text-charcoal-800 text-sm leading-tight mb-1.5 truncate",
              completedToday && "text-sage-700"
            )}
          >
            {habit.name}
          </h3>

          {/* Streak badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-medium transition-all",
              habit.streak > 0
                ? "bg-orange-50 text-orange-600"
                : "bg-sage-50 text-sage-400",
              streakAnimating && "streak-pop"
            )}
          >
            <Flame
              className={cn(
                "w-3 h-3",
                habit.streak > 0 ? "text-orange-500" : "text-sage-300"
              )}
            />
            {habit.streak > 0 ? `${habit.streak} day streak` : "Start your streak"}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Complete toggle */}
          <button
            ref={buttonRef}
            onClick={handleToggle}
            disabled={toggling}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 font-body text-xs font-medium",
              completedToday
                ? "bg-sage-600 text-white shadow-sm"
                : "bg-sage-50 text-sage-400 hover:bg-sage-100 border border-sage-200",
              toggling && "opacity-60 scale-95"
            )}
            title={completedToday ? "Mark incomplete" : "Mark complete"}
          >
            {toggling ? (
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>

          {/* Delete (visible on hover) */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sage-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 duration-200"
            title="Delete habit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekly progress dots */}
      <div className="flex items-center gap-1.5">
        {weekDates.map((date, i) => (
          <div key={date} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={cn(
                "w-full h-5 rounded-full transition-all duration-300",
                weeklyCompletion[i]
                  ? "bg-sage-400"
                  : date === today
                  ? "bg-cream-200 ring-1 ring-cream-400 ring-offset-1"
                  : "bg-sage-50"
              )}
            />
            <span className="text-sage-300 font-mono text-xs">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>

      {/* Completion label */}
      {completedToday && (
        <div className="mt-3 flex items-center gap-1.5 text-sage-500 font-body text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-sage-400" />
          Completed today
        </div>
      )}
    </div>
  );
}
