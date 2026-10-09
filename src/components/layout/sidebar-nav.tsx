"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Tags,
  Package,
  CalendarRange,
  Upload,
  Menu,
  X,
  MapPin,
} from "lucide-react";

const NAV = [
  { href: "/overview", label: "Sales Overview", icon: LayoutDashboard },
  { href: "/stores", label: "Per Store", icon: Store },
  { href: "/brands", label: "Brand & Kategori", icon: Tags },
  { href: "/products", label: "Top Products", icon: Package },
  { href: "/weeks", label: "Week-over-Week", icon: CalendarRange },
];

export function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = isAdmin
    ? [...NAV, { href: "/upload", label: "Upload Data", icon: Upload }]
    : NAV;

  const content = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={
              active
                ? "flex items-center gap-3 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white"
                : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            }
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm md:hidden"
        aria-label="Buka menu"
      >
        <Menu size={18} />
      </button>

      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-5 md:block">
        <Brand />
        {content}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white px-4 py-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Brand />
              <button onClick={() => setOpen(false)} aria-label="Tutup menu">
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

function Brand() {
  return (
    <div className="mb-6 flex items-center gap-2 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
        <MapPin size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">OneMapTech</p>
        <p className="text-xs text-slate-400">Sales Dashboard</p>
      </div>
    </div>
  );
}
