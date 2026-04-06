"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@nidorali/ui";

const steps = [
  { href: "/configure/branding", label: "Branding" },
  { href: "/configure/modules", label: "Modules" },
  { href: "/configure/users", label: "Utilisateurs" },
  { href: "/configure/summary", label: "Récapitulatif" },
  { href: "/configure/payment", label: "Paiement" },
];

/**
 * Navigation du wizard multi-étapes.
 */
export function WizardNav() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => step.href === pathname);

  return (
    <nav aria-label="Étapes du configurateur" className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-5 md:overflow-visible">
      {steps.map((step, index) => {
        const active = pathname === step.href;
        const completed = currentStepIndex > index;
        return (
          <Link
            aria-current={active ? "step" : undefined}
            className={cn(
              "min-w-[11rem] rounded-3xl border px-4 py-3 text-sm font-semibold md:min-w-0",
              active
                ? "border-brand-500 bg-brand-500 text-white"
                : completed
                  ? "border-brand-500/40 bg-brand-500/10 text-brand-100 hover:border-brand-400"
                  : "border-white/10 bg-white/5 text-slate-200 hover:border-brand-400",
            )}
            href={step.href}
            key={step.href}
          >
            <span className="flex items-center justify-between gap-3">
              <span>{index + 1}. {step.label}</span>
              {completed ? <span aria-hidden="true">✓</span> : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
