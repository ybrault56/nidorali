import { PageShell, SectionCard } from "@nidorali/ui";
import Link from "next/link";

import { SiteFooter } from "../../components/marketing/SiteFooter";
import { SiteHeader } from "../../components/marketing/SiteHeader";

/**
 * Page de confirmation post-paiement orientée client.
 */
export default function SuccessPage() {
  return (
    <PageShell contentClassName="max-w-5xl gap-8">
      <SiteHeader ctaHref="/orders" ctaLabel="Suivi client" />
      <SectionCard className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-brand-600">Commande confirmée</p>
          <h1 className="text-balance text-3xl font-semibold text-slate-950">Votre application native est en préparation</h1>
          <p className="text-pretty text-sm text-slate-600">
            Nidorali crée maintenant votre tenant, prépare les assets, lance les builds Android + iOS puis suit la validation sur les stores.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Étape 1</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Création</p>
            <p className="mt-2 text-sm text-slate-600">Configuration du tenant, assets et nomenclature.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Étape 2</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Validation stores</p>
            <p className="mt-2 text-sm text-slate-600">Soumission Android et iOS avec suivi d&apos;avancement.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Étape 3</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Déploiement</p>
            <p className="mt-2 text-sm text-slate-600">Liens de téléchargement disponibles dans votre espace client.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/orders">
            <span className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600">
              Ouvrir mon suivi client
            </span>
          </Link>
          <Link href="/configure/branding">
            <span className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-200">
              Commander une autre app
            </span>
          </Link>
        </div>
      </SectionCard>
      <SiteFooter />
    </PageShell>
  );
}
