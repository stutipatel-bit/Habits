import { createBrowserClient } from "@supabase/ssr";

// Client-side Supabase client (use in React components and client-side code)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Convenience export for direct use
export const supabase = createClient();
