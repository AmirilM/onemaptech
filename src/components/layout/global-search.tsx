"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function GlobalSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <form onSubmit={onSubmit} className="relative hidden md:block">
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari produk…"
        className="h-9 w-56 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
    </form>
  );
}
