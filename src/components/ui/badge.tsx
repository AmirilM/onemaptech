import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-surface-muted text-muted",
        brand: "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300",
        success:
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
        warning:
          "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
        outline: "border border-border text-muted",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
