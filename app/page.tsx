import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export default async function Home() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    console.log("No user found, redirecting to login");
    redirect("/auth/login");
  }
}
