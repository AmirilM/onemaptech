import type { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getProfile(
  supabase: SupabaseServerClient,
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (data) return data as Profile;

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: user.email ?? null,
    role: "viewer",
    created_at: new Date().toISOString(),
  };
}
