import * as React from "react";
import { cn } from "@nidorali/ui";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Champ texte standard du dashboard.
 */
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
        className,
      )}
      {...props}
    />
  );
}
