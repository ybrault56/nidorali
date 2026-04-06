"use client";

import { SectionCard } from "@nidorali/ui";
import { MODULE_DEFINITIONS } from "@nidorali/types";
import { useRouter } from "next/navigation";

import { formatPriceEur } from "../../lib/pricing";
import { useConfiguratorStore } from "../../store/configurator";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

/**
 * Étape de récapitulatif final avant paiement.
 */
export function SummaryStep() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const activeModules = MODULE_DEFINITIONS.filter((module) => store[module.key]);

  return (
    <SectionCard className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-balance text-3xl font-semibold text-slate-950">Validez votre configuration.</h1>
          <p className="text-pretty text-sm text-slate-600">Ce récapitulatif est réutilisé tel quel pour Stripe, Supabase et le build-service.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 p-5">
            <p className="text-sm text-slate-500">App</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{store.app_name}</p>
            <p className="mt-1 text-sm text-slate-600">{store.bundle_id}</p>
            <p className="mt-1 text-sm text-slate-600">{store.slug}</p>
            <p className="mt-1 text-sm text-slate-600">{store.billing_email}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Abonnement</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{formatPriceEur(store.getMonthlyPrice())}/mois</p>
            <p className="mt-1 text-sm text-slate-600">{store.max_users.toLocaleString("fr-FR")} utilisateurs inclus</p>
            <div className="mt-3 flex gap-2">
              <Badge>{store.plan}</Badge>
              <Badge>{activeModules.length} modules</Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeModules.map((module) => (
            <Badge key={module.key}>{module.label}</Badge>
          ))}
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Après le paiement</p>
          <ul className="mt-3 space-y-2 text-pretty text-sm text-slate-600">
            <li>1. Création du tenant et de sa configuration.</li>
            <li>2. Déclenchement du build Android et iOS.</li>
            <li>3. Suivi du provisioning dans le back-office Nidorali.</li>
          </ul>
        </div>
        <div className="flex justify-between gap-3">
          <Button onClick={() => router.push("/configure/users")} variant="secondary">
            Retour
          </Button>
          <Button onClick={() => router.push("/configure/payment")}>Passer au paiement</Button>
        </div>
    </SectionCard>
  );
}
