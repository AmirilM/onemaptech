import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
