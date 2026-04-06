"use client";

import { cn } from "@nidorali/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "../shared/Logo";

const marketingLinks = [
  { href: "/#accueil", label: "Accueil" },
  { href: "/#services", label: "Services" },
  { href: "/#vision", label: "Notre Vision" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/#faq", label: "FAQ" },
];

interface SiteHeaderProps {
  ctaHref?: string;
  ctaLabel?: string;
}

/**
 * Barre de navigation principale du parcours client Nidorali.
 *
 * @param props - Libellé et destination du CTA principal
 * @returns Header marketing réutilisable sur la landing et le tunnel
 */
export function SiteHeader({ ctaHref = "/configure/branding", ctaLabel = "Commander" }: SiteHeaderProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header className="rounded-[2rem] border border-white/10 bg-slate-950/80 px-5 py-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Logo className="text-[2.25rem]" />
          <Link
            aria-label="Ouvrir le suivi client"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-200 lg:hidden"
            href="/orders"
          >
            Suivi
          </Link>
        </div>
        <nav aria-label="Navigation principale" className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-100">
          {marketingLinks.map((link) => (
            <Link
              className={cn(
                "rounded-full px-3 py-2 hover:text-brand-300",
                !isLanding && link.href.startsWith("/#") && "pointer-events-none opacity-60",
              )}
              href={isLanding ? link.href : "/"}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            aria-label="Ouvrir le suivi client"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-200"
            href="/orders"
          >
            Se connecter
          </Link>
          <Link
            aria-label={ctaLabel}
            className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600"
            href={ctaHref}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
