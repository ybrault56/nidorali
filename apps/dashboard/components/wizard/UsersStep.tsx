"use client";

import { SectionCard, cn } from "@nidorali/ui";
import { useRouter } from "next/navigation";

import { formatPriceEur, resolveUserTier } from "../../lib/pricing";
import { useConfiguratorStore } from "../../store/configurator";
import { Button } from "../ui/Button";

const presets = [100, 500, 2000, 10000];

/**
 * Étape de choix du quota utilisateurs.
 */
export function UsersStep() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const tier = resolveUserTier(store.max_users);

  return (
    <SectionCard className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-balance text-3xl font-semibold text-slate-950">Dimensionnez votre audience.</h1>
          <p className="text-pretty text-sm text-slate-600">Le palier choisi s’applique automatiquement au calcul mensuel et au provisioning du tenant.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {presets.map((preset) => (
            <button
              className={cn(
                "rounded-2xl border px-4 py-4 text-left",
                store.max_users === preset ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white",
              )}
              key={preset}
              onClick={() => store.setUsers(preset)}
              type="button"
            >
              <p className="text-lg font-semibold text-slate-950">{preset.toLocaleString("fr-FR")}</p>
              <p className="text-sm text-slate-600">utilisateurs max</p>
            </button>
          ))}
        </div>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Affiner le quota</span>
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
        </label>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">Palier sélectionné</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 tabular-nums">{store.max_users.toLocaleString("fr-FR")} utilisateurs</p>
          <p className="mt-2 text-sm text-slate-600">Surcoût associé : {formatPriceEur(tier.extra)}</p>
          <p className="mt-2 text-sm text-slate-600">Total projeté : {formatPriceEur(store.getMonthlyPrice())}/mois</p>
        </div>
        <div className="flex justify-between gap-3">
          <Button onClick={() => router.push("/configure/modules")} variant="secondary">
            Retour
          </Button>
          <Button onClick={() => router.push("/configure/summary")}>Continuer</Button>
        </div>
    </SectionCard>
  );
}
