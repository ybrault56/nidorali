import * as React from "react";

import { cn } from "../lib/cn.js";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
}

/**
 * Affiche une métrique concise avec son libellé.
 *
 * @param props - Données textuelles et attributs du conteneur
 * @returns Une carte compacte prête pour les dashboards
 */
export function MetricCard({ className, label, value, ...props }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
      {...props}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
