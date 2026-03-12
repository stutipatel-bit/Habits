-- ============================================================
-- HabitFlow — Supabase Database Schema
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── habits table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  streak     INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── habit_logs table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id   UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  completed  BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(habit_id, date)           -- one log per habit per day
);

-- ─── Row Level Security (RLS) ────────────────────────────────
-- RLS ensures users can only see/edit their own data.

ALTER TABLE habits    ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- Habits: users can only access rows where user_id = their own auth.uid()
CREATE POLICY "habits: users manage own habits"
  ON habits
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Habit logs: users can only access logs for their own habits
CREATE POLICY "habit_logs: users manage own logs"
  ON habit_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_logs.habit_id
        AND habits.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_logs.habit_id
        AND habits.user_id = auth.uid()
    )
  );

-- ─── Indexes for performance ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_habits_user_id       ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id  ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date      ON habit_logs(date);
