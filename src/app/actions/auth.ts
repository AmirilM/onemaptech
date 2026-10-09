"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSalesId, normalizeSalesId, toAuthEmail } from "@/lib/auth-identifier";

export async function signIn(formData: FormData) {
  const salesId = normalizeSalesId(String(formData.get("salesId") ?? ""));
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectedFrom") ?? "/overview");

  if (!isSalesId(salesId)) {
    redirect(`/login?error=${encodeURIComponent("Sales ID harus berupa angka.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: toAuthEmail(salesId),
    password,
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent("Sales ID atau password salah.")}`,
    );
  }

  redirect(redirectTo || "/overview");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
