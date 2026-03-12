import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import DashboardClient from "@/components/DashboardClient";
import { seedHabitsForNewUser } from "@/lib/seedUtils";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  // Check auth — redirect to login if not authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's habits
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  // Seed demo habits for brand new users with no habits
  if (!habits || habits.length === 0) {
    await seedHabitsForNewUser(user.id, supabase);
    // Re-fetch after seeding
    const { data: seededHabits } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    return (
      <DashboardClient
        initialHabits={seededHabits ?? []}
        userEmail={user.email ?? ""}
        userId={user.id}
      />
    );
  }

  return (
    <DashboardClient
      initialHabits={habits}
      userEmail={user.email ?? ""}
      userId={user.id}
    />
  );
}
