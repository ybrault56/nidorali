import Link from "next/link";

/**
 * Pied de page marketing du dashboard public.
 *
 * @returns Liens légaux et signature de marque
 */
export function SiteFooter() {
  return (
    <footer className="rounded-[2rem] border border-white/10 bg-slate-950/70 px-6 py-5 text-sm text-slate-300">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-pretty">© 2026 Nidorali. Tous droits réservés.</p>
        <div className="flex flex-wrap gap-4">
          <Link className="hover:text-brand-300" href="/">
            Mentions légales
          </Link>
          <Link className="hover:text-brand-300" href="/">
            Charte Vie Privée
          </Link>
          <Link className="hover:text-brand-300" href="/">
            CGU
          </Link>
        </div>
      </div>
    </footer>
  );
}
