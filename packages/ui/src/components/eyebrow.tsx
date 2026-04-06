import * as React from "react";

import { cn } from "../lib/cn.js";

export type EyebrowProps = React.HTMLAttributes<HTMLParagraphElement>;

/**
 * Affiche un libellé court au-dessus d'une section.
 *
 * @param props - Propriétés HTML du paragraphe
 * @returns Un texte d'accroche stylé
 */
export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-sm font-semibold uppercase text-brand-500",
        className,
      )}
      {...props}
    />
  );
}
