export interface Habit {
  id: string;
  user_id: string;
  name: string;
  streak: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
}

export interface HabitWithLogs extends Habit {
  habit_logs: HabitLog[];
  completedToday: boolean;
  weeklyLogs: boolean[]; // 7 days, index 0 = Monday
}
