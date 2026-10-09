"use client";

import { signOut } from "@/app/actions/auth";
import type { Profile } from "@/lib/types";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ profile }: { profile: Profile }) {
  const name = profile.sales_id ?? profile.full_name ?? profile.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 rounded-lg p-1 pr-2 text-left transition-colors hover:bg-surface-muted">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-medium leading-none text-foreground">
              {name}
            </span>
            <span className="mt-0.5 block text-[11px] capitalize leading-none text-subtle">
              {profile.role}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <span className="block text-foreground">{name}</span>
          <span className="block text-[11px] capitalize">{profile.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/settings">
            <UserIcon size={15} />
            Pengaturan
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOut}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full text-brand-500">
              <LogOut size={15} />
              Keluar
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
