import { redirect } from "next/navigation";
import { Upload as UploadIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { UploadForm } from "./upload-form";

export default async function UploadPage() {
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
          icon={<UploadIcon size={20} />}
          title="Akses terbatas"
          description="Halaman ini hanya dapat diakses oleh admin."
        />
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-lg font-semibold text-foreground">
          Upload Data
        </h1>
        <p className="text-sm text-muted">
          Unggah file Excel transaksi harian untuk memperbarui dashboard.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
