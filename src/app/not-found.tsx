import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="font-display text-5xl font-bold text-brand-500">404</p>
      <h1 className="font-display text-lg font-semibold text-foreground">
        Halaman tidak ditemukan
      </h1>
      <p className="max-w-sm text-sm text-muted">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Button asChild>
        <Link href="/overview">Kembali ke Dashboard</Link>
      </Button>
    </div>
  );
}
