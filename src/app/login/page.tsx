import { MapPin } from "lucide-react";
import { signIn } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectedFrom?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
            <MapPin size={24} />
          </div>
          <h1 className="mt-3 font-display text-xl font-semibold text-foreground">
            OneMapTech
          </h1>
          <p className="text-sm text-muted">Dashboard Penjualan Toko</p>
        </div>

        <form
          action={signIn}
          className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm"
        >
          <input
            type="hidden"
            name="redirectedFrom"
            value={params.redirectedFrom ?? "/overview"}
          />

          {params.error ? (
            <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-600 dark:bg-brand-950 dark:text-brand-300">
              {params.error}
            </p>
          ) : null}

          <div>
            <Label htmlFor="salesId">Sales ID</Label>
            <Input
              id="salesId"
              type="text"
              name="salesId"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="username"
              placeholder="22008205"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}
