"use client";

import { SectionCard, cn } from "@nidorali/ui";
import { MODULE_DEFINITIONS, PRICING } from "@nidorali/types";
import { useRouter } from "next/navigation";

import { formatPriceEur } from "../../lib/pricing";
import { useConfiguratorStore } from "../../store/configurator";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

/**
 * Étape de sélection des modules.
 */
export function ModulesStep() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const activeModules = MODULE_DEFINITIONS.filter((module) => store[module.key]);

  return (
    <SectionCard className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-balance text-3xl font-semibold text-slate-950">Composez votre application modulaire.</h1>
          <p className="text-pretty text-sm text-slate-600">Activez uniquement les briques utiles à vos clients et visualisez immédiatement leur impact tarifaire.</p>
        </div>
        <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Modules sélectionnés</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950 tabular-nums">{activeModules.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total actuel</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950 tabular-nums">{formatPriceEur(store.getMonthlyPrice())}/mois</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {MODULE_DEFINITIONS.map((module) => {
            const enabled = store[module.key];
            const price = PRICING.modules[module.key];
            return (
              <button
                aria-pressed={enabled}
                className={cn(
                  "rounded-[1.75rem] border p-5 text-left transition-colors duration-150 hover:border-brand-400",
                  enabled ? "border-brand-500 bg-brand-50/60" : "border-slate-200 bg-white",
                )}
                key={module.key}
                onClick={() => store.setModules({ [module.key]: !enabled })}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-slate-950">{module.label}</p>
                    <p className="text-pretty text-sm text-slate-600">{module.description}</p>
                  </div>
                  <Badge className={enabled ? "" : "border-slate-200 bg-white text-slate-500"}>{enabled ? "Actif" : "Inactif"}</Badge>
                </div>
                <p className="mt-5 text-sm font-medium text-slate-700">
                  {price === 0 ? "Inclus" : `+ ${(price / 100).toFixed(0)} €/mois`}
                </p>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between gap-3">
          <Button onClick={() => router.push("/configure/branding")} variant="secondary">
            Retour
          </Button>
          <Button onClick={() => router.push("/configure/users")}>Continuer</Button>
        </div>
    </SectionCard>
  );
}
