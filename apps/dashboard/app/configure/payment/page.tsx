"use client";

import { SectionCard } from "@nidorali/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createCheckoutSession } from "../../../lib/api";
import { formatPriceEur } from "../../../lib/pricing";
import { useConfiguratorStore } from "../../../store/configurator";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";

/**
 * Étape de paiement Stripe.
 */
export default function PaymentPage() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const plans = ["starter", "pro", "enterprise"] as const;

  return (
    <SectionCard className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold text-slate-950">Finaliser l’abonnement</h1>
        <p className="text-pretty text-sm text-slate-600">Le paiement déclenche ensuite la création du tenant et la file de build automatisée.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {plans.map((plan) => (
          <button
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${store.plan === plan ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-700"}`}
            key={plan}
            onClick={() => store.setPlan(plan)}
            type="button"
          >
            {plan}
          </button>
        ))}
      </div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm text-slate-500">Total mensuel</p>
        <p className="mt-2 text-3xl font-semibold text-slate-950">{formatPriceEur(store.getMonthlyPrice())}</p>
        <div className="mt-3 flex gap-2">
          <Badge>{store.plan}</Badge>
          <Badge>{store.max_users.toLocaleString("fr-FR")} utilisateurs</Badge>
        </div>
        <p className="mt-3 text-sm text-slate-600">Email de facturation : {store.billing_email}</p>
      </div>
      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      <div className="flex justify-between gap-3">
        <Button onClick={() => router.push("/configure/summary")} variant="secondary">
          Retour
        </Button>
        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const session = await createCheckoutSession(store.getPayload());
              if (session.url) {
                window.location.href = session.url;
              }
            } catch (checkoutError) {
              setError(checkoutError instanceof Error ? checkoutError.message : "Le paiement n'a pas pu être initialisé.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Redirection…" : "Payer avec Stripe"}
        </Button>
      </div>
    </SectionCard>
  );
}
