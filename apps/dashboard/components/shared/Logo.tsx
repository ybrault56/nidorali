import { cn } from "@nidorali/ui";

/**
 * Logo textuel Nidorali.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-heading text-3xl font-bold text-brand-400", className)}>
      Nidorali
    </span>
  );
}
