"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { getTodayDate, getWeekDates, getInitials } from "@/lib/utils";
import type { Habit, HabitLog } from "@/types";
import HabitCard from "./HabitCard";
import AddHabitModal from "./AddHabitModal";
import ProgressSummary from "./ProgressSummary";
import {
  Leaf,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";

interface Props {
  initialHabits: Habit[];
  userEmail: string;
  userId: string;
}

export default function DashboardClient({ initialHabits, userEmail, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logs, setLogs] = useState<Record<string, HabitLog[]>>({}); // habitId → logs
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const weekDates = getWeekDates();
  const today = getTodayDate();

  // Load logs for the current week for all habits
  const fetchLogs = useCallback(async () => {
    if (habits.length === 0) {
      setLoadingLogs(false);
      return;
    }

    const habitIds = habits.map((h) => h.id);
    const startDate = weekDates[0];
    const endDate = weekDates[6];

    const { data } = await supabase
      .from("habit_logs")
      .select("*")
      .in("habit_id", habitIds)
      .gte("date", startDate)
      .lte("date", endDate);

    // Group logs by habit_id
    const grouped: Record<string, HabitLog[]> = {};
    for (const log of data ?? []) {
      if (!grouped[log.habit_id]) grouped[log.habit_id] = [];
      grouped[log.habit_id].push(log);
    }

    setLogs(grouped);
    setLoadingLogs(false);
  }, [habits, supabase, weekDates]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Toggle today's completion for a habit
  async function handleToggleComplete(habitId: string, currentlyCompleted: boolean) {
    const habitLogs = logs[habitId] ?? [];
    const todayLog = habitLogs.find((l) => l.date === today);

    if (currentlyCompleted && todayLog) {
      // Un-complete: delete today's log
      await supabase.from("habit_logs").delete().eq("id", todayLog.id);

      // Decrease streak (min 0)
      const habit = habits.find((h) => h.id === habitId);
      const newStreak = Math.max(0, (habit?.streak ?? 1) - 1);
      await supabase.from("habits").update({ streak: newStreak }).eq("id", habitId);

      // Update local state
      setLogs((prev) => ({
        ...prev,
        [habitId]: (prev[habitId] ?? []).filter((l) => l.date !== today),
      }));
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, streak: newStreak } : h))
      );
    } else {
      // Complete: insert new log
      const { data: newLog } = await supabase
        .from("habit_logs")
        .insert({ habit_id: habitId, date: today, completed: true })
        .select()
        .single();

      // Increase streak
      const habit = habits.find((h) => h.id === habitId);
      const newStreak = (habit?.streak ?? 0) + 1;
      await supabase.from("habits").update({ streak: newStreak }).eq("id", habitId);

      // Update local state
      if (newLog) {
        setLogs((prev) => ({
          ...prev,
          [habitId]: [...(prev[habitId] ?? []), newLog],
        }));
      }
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, streak: newStreak } : h))
      );
    }
  }

  // Delete a habit
  async function handleDeleteHabit(habitId: string) {
    await supabase.from("habit_logs").delete().eq("habit_id", habitId);
    await supabase.from("habits").delete().eq("id", habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  }

  // Add a new habit
  async function handleAddHabit(name: string) {
    const { data: newHabit } = await supabase
      .from("habits")
      .insert({ user_id: userId, name, streak: 0 })
      .select()
      .single();

    if (newHabit) {
      setHabits((prev) => [...prev, newHabit]);
    }
    setShowAddModal(false);
  }

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  // Compute today's completion count for progress summary
  const completedTodayCount = habits.filter((h) =>
    (logs[h.id] ?? []).some((l) => l.date === today)
  ).length;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-cream-50/90 backdrop-blur-sm border-b border-sage-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-sage-700 rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-cream-50" />
            </div>
            <span className="font-display text-xl text-charcoal-800">HabitFlow</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center text-sage-700 font-body font-medium text-sm">
                {getInitials(userEmail)}
              </div>
              <span className="hidden sm:block text-sage-600 font-body text-sm">
                {userEmail.split("@")[0]}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sage-500 hover:text-sage-700 font-body text-sm transition-colors px-2 py-1 rounded-lg hover:bg-sage-100"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-display text-3xl text-charcoal-800 mb-1">
            Good {getGreeting()},{" "}
            <span className="text-sage-600">{userEmail.split("@")[0]}</span>
          </h1>
          <p className="text-sage-500 font-body text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Progress summary */}
        {habits.length > 0 && (
          <ProgressSummary
            total={habits.length}
            completed={completedTodayCount}
          />
        )}

        {/* Section header */}
        <div className="flex items-center justify-between mb-4 mt-8">
          <h2 className="font-body font-semibold text-charcoal-800 text-base">
            Your habits
            {habits.length > 0 && (
              <span className="ml-2 text-sage-400 font-normal text-sm">
                ({habits.length})
              </span>
            )}
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sage-700 hover:bg-sage-800 text-cream-50 font-body text-sm rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add habit
          </button>
        </div>

        {/* Habit list */}
        {loadingLogs ? (
          <LoadingSkeleton count={habits.length || 3} />
        ) : habits.length === 0 ? (
          <EmptyState onAdd={() => setShowAddModal(true)} />
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="habit-card">
                <HabitCard
                  habit={habit}
                  logs={logs[habit.id] ?? []}
                  weekDates={weekDates}
                  today={today}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteHabit}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Habit Modal */}
      {showAddModal && (
        <AddHabitModal
          onAdd={handleAddHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-6 h-6 text-sage-500" />
      </div>
      <h3 className="font-display text-xl text-charcoal-800 mb-2">No habits yet</h3>
      <p className="text-sage-500 font-body text-sm mb-6 max-w-xs mx-auto">
        Start building your daily routine. Add your first habit and begin your streak today.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-700 hover:bg-sage-800 text-cream-50 font-body font-medium text-sm rounded-xl transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Add your first habit
      </button>
    </div>
  );
}

function LoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 shadow-card animate-pulse"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-sage-100 rounded-full w-32" />
            <div className="h-8 w-8 bg-sage-100 rounded-full" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="flex-1 h-6 bg-sage-50 rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
