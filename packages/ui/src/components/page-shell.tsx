import * as React from "react";

import { cn } from "../lib/cn.js";

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
}

/**
 * Fournit une coque de page cohérente pour le dashboard.
 *
 * @param props - Contenu et classes additionnelles
 * @returns Une section centrée avec largeur maximale et espacements cohérents
 */
export function PageShell({
  children,
  className,
  contentClassName,
  ...props
}: PageShellProps) {
  return (
    <section className={cn("min-h-dvh bg-shell text-slate-50", className)} {...props}>
      <div className={cn("mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-10", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
