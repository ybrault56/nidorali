import { PageShell, SectionCard, cn } from "@nidorali/ui";
import Link from "next/link";

/**
 * Page de confirmation post-paiement.
 */
export default function SuccessPage() {
  return (
    <PageShell contentClassName="max-w-3xl">
      <SectionCard className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-balance text-3xl font-semibold text-slate-950">Commande confirmée</h1>
          <p className="text-pretty text-sm text-slate-600">Votre tenant passe en provisioning, puis le pipeline de build prépare Android et iOS automatiquement.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Prochaines étapes</p>
          <ul className="mt-3 space-y-2 text-pretty text-sm text-slate-600">
            <li>1. Vérifier la création du tenant.</li>
            <li>2. Suivre la progression du build dans le back-office.</li>
            <li>3. Relancer un build manuel si nécessaire.</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className={cn(
              "inline-flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            )}
            href="/admin/tenants"
          >
            Ouvrir les tenants
          </Link>
          <Link
            className={cn(
              "inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            )}
            href="/admin/builds"
          >
            Suivre les builds
          </Link>
          <Link
            className={cn(
              "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            )}
            href="/configure"
          >
            Configurer une autre app
          </Link>
        </div>
      </SectionCard>
    </PageShell>
  );
}
