"use client";

import type { CustomerOrderSummary } from "@nidorali/types";
import { PageShell } from "@nidorali/ui";
import { useEffect, useState } from "react";

import { CustomerAuthCard } from "../../components/customer/CustomerAuthCard";
import { CustomerOrderList } from "../../components/customer/CustomerOrderList";
import { SiteFooter } from "../../components/marketing/SiteFooter";
import { SiteHeader } from "../../components/marketing/SiteHeader";
import { listCustomerOrders } from "../../lib/api";
import { useCustomerSessionStore } from "../../store/customer-session";
import { useConfiguratorStore } from "../../store/configurator";

/**
 * Espace client de suivi des commandes et des déploiements.
 *
 * @returns Portail client connecté
 */
export default function OrdersPage() {
  const billingEmail = useConfiguratorStore((state) => state.billing_email);
  const setOrganization = useConfiguratorStore((state) => state.setOrganization);
  const session = useCustomerSessionStore((state) => ({
    account: state.account,
    token: state.token,
  }));
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session.token) {
      setOrders([]);
      return;
    }

    let active = true;
    const loadOrders = async () => {
      try {
        const nextOrders = await listCustomerOrders(session.token!);
        if (active) {
          setOrders(nextOrders);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Le suivi client n'a pas pu être chargé.");
        }
      }
    };

    void loadOrders();
    const interval = window.setInterval(() => {
      void loadOrders();
    }, 4_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [session.token]);

  return (
    <PageShell contentClassName="gap-8">
      <SiteHeader ctaHref="/configure/branding" ctaLabel="Commander" />
      {!session.token || !session.account ? (
        <CustomerAuthCard
          defaultMode="login"
          description="Connectez-vous avec l'email utilisé pendant la commande pour suivre la création, la validation stores et les liens de téléchargement."
          email={billingEmail}
          onEmailChange={(email) => setOrganization({ billing_email: email })}
          title="Accéder à mon espace client"
        />
      ) : (
        <>
          {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          <CustomerOrderList orders={orders} />
        </>
      )}
      <SiteFooter />
    </PageShell>
  );
}
