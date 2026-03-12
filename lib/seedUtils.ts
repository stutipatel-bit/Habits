import type { SupabaseClient } from "@supabase/supabase-js";

const DEMO_HABITS = [
  "Drink 8 glasses of water 💧",
  "Read for 20 minutes 📚",
  "Workout 🏋️",
  "Sleep by 11pm 😴",
];

/**
 * Seeds demo habits for a brand-new user.
 * Called server-side when a user logs in and has zero habits.
 */
export async function seedHabitsForNewUser(
  userId: string,
  supabase: SupabaseClient
) {
  const habitsToInsert = DEMO_HABITS.map((name) => ({
    user_id: userId,
    name,
    streak: 0,
  }));

  const { error } = await supabase.from("habits").insert(habitsToInsert);

  if (error) {
    console.error("Error seeding habits:", error.message);
  }
}
