import { redirect } from "next/navigation";
import { Users as UsersIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import type { Profile } from "@/lib/types";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default async function UsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getProfile(supabase);
  if (profile?.role !== "admin") {
    return (
      <Card>
        <EmptyState
          icon={<UsersIcon size={20} />}
          title="Akses terbatas"
          description="Halaman ini hanya dapat diakses oleh admin."
        />
      </Card>
    );
  }

  const { data } = await supabase
    .from("profiles")
    .select("id,email,sales_id,full_name,role,created_at")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as Profile[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-lg font-semibold text-foreground">
          Manajemen User
        </h1>
        <p className="text-sm text-muted">Daftar akun Sales ID yang terdaftar.</p>
      </div>

      <Card>
        <CardTitle
          subtitle={`${users.length} akun terdaftar`}
          action={<Badge variant="outline">read-only</Badge>}
        >
          Akun
        </CardTitle>
        {users.length ? <UserTable users={users} /> : <EmptyState title="Belum ada user" />}
      </Card>
    </div>
  );
}

function UserTable({ users }: { users: Profile[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase text-subtle">
            <th className="py-2 pr-3 font-medium">Sales ID</th>
            <th className="py-2 pr-3 font-medium">Nama</th>
            <th className="py-2 text-right font-medium">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-b border-border/60 last:border-0 hover:bg-surface-muted"
            >
              <td className="py-2 pr-3 font-mono text-foreground">
                {u.sales_id ?? "-"}
              </td>
              <td className="py-2 pr-3 text-foreground">
                {u.full_name ?? "-"}
              </td>
              <td className="py-2 text-right">
                <Badge variant={u.role === "admin" ? "brand" : "neutral"}>
                  {u.role}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
