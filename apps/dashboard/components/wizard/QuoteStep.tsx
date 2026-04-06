"use client";

import { SectionCard } from "@nidorali/ui";
import { MODULE_DEFINITIONS } from "@nidorali/types";
import { useRouter } from "next/navigation";

import { formatPriceEur, resolveUserTier } from "../../lib/pricing";
import { useConfiguratorStore } from "../../store/configurator";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const userPresets = [100, 500, 2000, 10000];

/**
 * Étape de proposition tarifaire et d'aperçu du projet.
 *
 * @returns Récapitulatif métier avant authentification et paiement
 */
export function QuoteStep() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const activeModules = MODULE_DEFINITIONS.filter((module) => store[module.key]);
  const userTier = resolveUserTier(store.max_users);

  return (
    <SectionCard className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-brand-600">Étape 4 sur 4</p>
        <h1 className="text-balance text-3xl font-semibold text-slate-950">Votre projet en un coup d&apos;œil</h1>
        <p className="text-pretty text-sm text-slate-600">
          Tout semble parfait ? Vérifiez les informations, ajustez le volume d&apos;utilisateurs et passez ensuite à la commande.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Application</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{store.app_name}</p>
          <p className="mt-2 text-sm text-slate-600">{store.organization_type}</p>
          <p className="mt-1 text-sm text-slate-600">{store.billing_email}</p>
          <p className="mt-4 text-xs uppercase text-slate-500">Nomenclature générée</p>
          <p className="mt-2 text-sm text-slate-700">{store.slug}</p>
          <p className="mt-1 break-all text-sm text-slate-700">{store.bundle_id}</p>
        </div>
        <div className="rounded-[1.75rem] border border-brand-200 bg-brand-50 p-5">
          <p className="text-sm text-brand-700">Proposition de prix</p>
          <p className="mt-2 text-4xl font-semibold text-slate-950">{formatPriceEur(store.getMonthlyPrice())}</p>
          <p className="mt-1 text-sm text-slate-700">par mois, publication native Android + iOS incluse</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{store.plan}</Badge>
            <Badge>{activeModules.length} modules</Badge>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Volume utilisateurs</p>
        <div className="grid gap-3 sm:grid-cols-4">
          {userPresets.map((preset) => (
            <button
              className={`rounded-2xl border px-4 py-4 text-left ${store.max_users === preset ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white"}`}
              key={preset}
              onClick={() => store.setUsers(preset)}
              type="button"
            >
              <p className="text-lg font-semibold text-slate-950">{preset.toLocaleString("fr-FR")}</p>
              <p className="text-sm text-slate-600">utilisateurs</p>
            </button>
          ))}
        </div>
        <input
          aria-label="Choisir le nombre maximal d'utilisateurs"
          className="w-full accent-brand-500"
          max={10000}
          min={100}
          onChange={(event) => store.setUsers(Number(event.target.value))}
          step={100}
          type="range"
          value={store.max_users}
        />
        <p className="text-sm text-slate-600">
          Palier actuel : <span className="font-semibold text-slate-950">{store.max_users.toLocaleString("fr-FR")} utilisateurs</span>
          {" · "}
          Surcoût associé : <span className="font-semibold text-slate-950">{formatPriceEur(userTier.extra)}</span>
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Modules choisis</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeModules.map((module) => (
              <Badge key={module.key}>{module.label}</Badge>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Après la commande</p>
          <ul className="mt-3 space-y-2 text-pretty text-sm text-slate-600">
            <li>1. Création du tenant et du compte client.</li>
            <li>2. Build natif Android + iOS.</li>
            <li>3. Suivi de validation stores depuis votre portail.</li>
          </ul>
        </div>
      </div>
      <p className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-pretty text-sm text-slate-600">
        Des ajustements de design pourront être faits après le paiement, avec notre équipe.
      </p>
      <div className="flex justify-between gap-3">
        <Button onClick={() => router.push("/configure/users")} variant="secondary">
          Retour
        </Button>
        <Button onClick={() => router.push("/configure/payment")}>Commander</Button>
      </div>
    </SectionCard>
  );
}
