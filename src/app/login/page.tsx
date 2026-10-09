import { MapPin } from "lucide-react";
import { signIn } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectedFrom?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <MapPin size={24} />
          </div>
          <h1 className="mt-3 text-xl font-semibold text-slate-900">
            OneMapTech
          </h1>
          <p className="text-sm text-slate-500">Dashboard Penjualan Toko</p>
        </div>

        <form
          action={signIn}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input
            type="hidden"
            name="redirectedFrom"
            value={params.redirectedFrom ?? "/overview"}
          />

          {params.error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {params.error}
            </p>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Sales ID
            </label>
            <input
              type="text"
              name="salesId"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="username"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="22008205"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
