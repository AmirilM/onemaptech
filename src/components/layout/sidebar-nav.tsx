"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";

export function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => {
        const items = group.items.filter((i) => !i.adminOnly || isAdmin);
        if (items.length === 0) return null;
        return (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-subtle">
              {group.title}
            </p>
            <nav className="flex flex-col gap-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300"
                        : "text-muted hover:bg-surface-muted hover:text-foreground",
                    )}
                  >
                    {active ? (
                      <span className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-brand-500" />
                    ) : null}
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-2.5 z-30 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground md:hidden"
        aria-label="Buka menu"
      >
        <Menu size={18} />
      </button>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-5 md:flex">
        <Brand />
        {content}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 animate-in overflow-y-auto bg-surface px-4 py-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-muted"
              >
                <X size={18} />
              </button>
            </div>
            {content}
          </div>
        </div>
      ) : null}
    </>
  );
}
