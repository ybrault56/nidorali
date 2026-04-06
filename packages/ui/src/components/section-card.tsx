import * as React from "react";

import { cn } from "../lib/cn.js";

export type SectionCardProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Carte principale pour regrouper un bloc de contenu du dashboard.
 *
 * @param props - Attributs HTML du conteneur
 * @returns Une carte pastel avec bordure douce et ombre légère
 */
export function SectionCard({ className, ...props }: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-white/10 bg-white/95 p-6 text-slate-950 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
