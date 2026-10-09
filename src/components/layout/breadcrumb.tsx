"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { FLAT_NAV } from "@/lib/nav";

export function Breadcrumb() {
  const pathname = usePathname();
  const current = FLAT_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link href="/overview" className="text-subtle hover:text-foreground">
        Dashboard
      </Link>
      {current ? (
        <>
          <ChevronRight size={14} className="text-subtle" />
          <span className="font-medium text-foreground">{current.label}</span>
        </>
      ) : null}
    </nav>
  );
}
