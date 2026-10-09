import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getProfile(supabase);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-lg font-semibold text-foreground">
          Pengaturan
        </h1>
        <p className="text-sm text-muted">Profil dan preferensi tampilan.</p>
      </div>

      <Card>
        <CardTitle subtitle="Informasi akun Anda">Profil</CardTitle>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Field label="Sales ID" value={profile?.sales_id ?? "-"} />
          <Field label="Email" value={profile?.email ?? "-"} />
          <Field label="Nama" value={profile?.full_name ?? "-"} />
          <Field
            label="Role"
            value={
              <Badge variant={profile?.role === "admin" ? "brand" : "neutral"}>
                {profile?.role ?? "viewer"}
              </Badge>
            }
          />
        </dl>
        <p className="mt-4 text-xs text-subtle">
          Perubahan profil (nama, password) dilakukan oleh admin melalui
          Supabase. Hubungi admin untuk reset password.
        </p>
      </Card>

      <Card>
        <CardTitle subtitle="Pilih tema tampilan dashboard">Tampilan</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Mode warna</span>
          <ThemeToggle />
        </div>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-surface-muted p-3">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
