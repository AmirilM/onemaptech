"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
] as const;

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = mounted && theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={opt.label}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-brand-500 text-white"
                : "text-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
