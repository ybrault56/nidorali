import * as React from "react";
import { cn } from "@nidorali/ui";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Badge léger pour les états et modules.
 */
export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700",
        className,
      )}
      {...props}
    />
  );
}
