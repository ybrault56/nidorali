import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne proprement des classes Tailwind et conditionnelles.
 *
 * @param inputs - Classes potentiellement conditionnelles
 * @returns Chaîne finale dédupliquée
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
