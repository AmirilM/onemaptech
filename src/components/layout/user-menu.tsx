import { LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import type { Profile } from "@/lib/types";

export function UserMenu({ profile }: { profile: Profile }) {
  const name = profile.sales_id ?? profile.full_name ?? profile.email;
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-slate-800">{name}</p>
        <p className="text-xs capitalize text-slate-400">{profile.role}</p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
        {name.charAt(0).toUpperCase()}
      </div>
      <form action={signOut}>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </form>
    </div>
  );
}
