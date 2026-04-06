"use client";

import { SectionCard } from "@nidorali/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createCheckoutSession } from "../../lib/api";
import { formatPriceEur } from "../../lib/pricing";
import { useConfiguratorStore } from "../../store/configurator";
import { useCustomerSessionStore } from "../../store/customer-session";
import { CustomerAuthCard } from "../customer/CustomerAuthCard";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

/**
 * Dernière étape du tunnel client: authentification puis redirection vers Stripe.
 *
 * @returns Bloc commande avec authentification client
 */
export function CheckoutStep() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const session = useCustomerSessionStore((state) => ({
    account: state.account,
    clearSession: state.clearSession,
    token: state.token,
  }));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const plans = ["starter", "pro", "enterprise"] as const;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      {!session.token || !session.account ? (
        <CustomerAuthCard
          defaultMode="register"
          description="Créez votre accès ou reconnectez-vous pour retrouver la commande et suivre son état d'avancement."
          email={store.billing_email}
          onEmailChange={(email) => store.setOrganization({ billing_email: email })}
          title="Créez votre accès client"
        />
      ) : (
        <SectionCard className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-brand-600">Compte connecté</p>
            <h2 className="text-balance text-2xl font-semibold text-slate-950">{session.account.display_name ?? session.account.email}</h2>
            <p className="text-pretty text-sm text-slate-600">
              Vous pourrez suivre la création, la validation stores et les liens de téléchargement depuis votre espace client.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email du compte</p>
            <p className="mt-2 text-sm font-semibold text-slate-950">{session.account.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-200"
              href="/orders"
            >
              Voir mes commandes
            </Link>
            <Button
              onClick={() => {
                session.clearSession();
                setError(null);
              }}
              variant="ghost"
            >
              Changer de compte
            </Button>
          </div>
        </SectionCard>
      )}
      <SectionCard className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-brand-600">Commande</p>
          <h1 className="text-balance text-3xl font-semibold text-slate-950">Finaliser l&apos;abonnement</h1>
          <p className="text-pretty text-sm text-slate-600">
            Une fois le paiement validé, Nidorali crée le tenant, prépare les assets et déclenche le build Android + iOS.
          </p>
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
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{store.plan}</Badge>
            <Badge>{store.max_users.toLocaleString("fr-FR")} utilisateurs</Badge>
            <Badge>Android + iOS</Badge>
          </div>
          <p className="mt-3 text-sm text-slate-600">Compte client : {store.billing_email}</p>
        </div>
        {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <div className="flex justify-between gap-3">
          <Button onClick={() => router.push("/configure/summary")} variant="secondary">
            Retour
          </Button>
          <Button
            disabled={loading || !session.token}
            onClick={async () => {
              if (!session.token) {
                setError("Connectez-vous ou créez votre compte client avant de commander.");
                return;
              }

              setLoading(true);
              setError(null);
              try {
                const stripeSession = await createCheckoutSession(store.getPayload(), session.token);
                if (stripeSession.url) {
                  window.location.href = stripeSession.url;
                }
              } catch (checkoutError) {
                setError(checkoutError instanceof Error ? checkoutError.message : "Le paiement n'a pas pu être initialisé.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Redirection..." : "Créer mon application native"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
