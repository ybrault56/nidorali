"use client";

import type { CustomerOrderSummary } from "@nidorali/types";
import { SectionCard } from "@nidorali/ui";
import Link from "next/link";

import { Badge } from "../ui/Badge";

/**
 * Transforme l'état de build en message métier lisible pour le client.
 *
 * @param order - Commande client enrichie
 * @returns Libellé, tonalité et description associée
 */
function getOrderPresentation(order: CustomerOrderSummary) {
  const buildStatus = order.latest_build?.status;

  if (buildStatus === "done") {
    return {
      description: "Votre application native Android et iOS est publiée. Les liens de téléchargement sont disponibles.",
      label: "Déployée sur les stores",
      tone: "success" as const,
    };
  }

  if (buildStatus === "submitting") {
    return {
      description: "Les binaires sont prêts. Nous sommes en cours de validation sur l'App Store et Google Play.",
      label: "En cours de validation sur les stores",
      tone: "warning" as const,
    };
  }

  if (buildStatus === "failed") {
    return {
      description: "Le dernier build demande une intervention de l'équipe Nidorali.",
      label: "Action requise",
      tone: "danger" as const,
    };
  }

  return {
    description: "Nous préparons actuellement votre app native, ses assets et son provisioning mobile.",
    label: "En cours de création",
    tone: "info" as const,
  };
}

/**
 * Affiche la liste des commandes et leur progression pour le client connecté.
 *
 * @param props - Commandes à rendre
 * @returns Liste de cartes de suivi client
 */
export function CustomerOrderList({ orders }: { orders: CustomerOrderSummary[] }) {
  if (orders.length === 0) {
    return (
      <SectionCard className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-balance text-2xl font-semibold text-slate-950">Aucune commande pour le moment</h2>
          <p className="text-pretty text-sm text-slate-600">
            Lancez une première commande pour déclencher la création de votre application native Android et iOS.
          </p>
        </div>
        <Link className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600" href="/configure/branding">
          Commander mon app
        </Link>
      </SectionCard>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => {
        const presentation = getOrderPresentation(order);
        return (
          <SectionCard className="space-y-5" key={order.tenant.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={
                      presentation.tone === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : presentation.tone === "warning"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : presentation.tone === "danger"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : "border-brand-200 bg-brand-50 text-brand-700"
                    }
                  >
                    {presentation.label}
                  </Badge>
                  <Badge>{order.tenant.plan}</Badge>
                </div>
                <h2 className="text-balance text-2xl font-semibold text-slate-950">{order.tenant.app_name}</h2>
                <p className="text-sm text-slate-500">{order.tenant.slug}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                <p className="text-xs uppercase text-slate-500">Provisioning</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{order.tenant.status}</p>
              </div>
            </div>
            <p className="text-pretty text-sm text-slate-600">{presentation.description}</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 p-4">
                <p className="text-xs uppercase text-slate-500">Native</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">Android + iOS</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 p-4">
                <p className="text-xs uppercase text-slate-500">Modules</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{Object.values(order.tenant.config).filter((value) => value === true).length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 p-4">
                <p className="text-xs uppercase text-slate-500">Clients finaux</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{order.tenant.config.max_users.toLocaleString("fr-FR")}</p>
              </div>
            </div>
            {order.latest_build?.status === "done" ? (
              <div className="flex flex-wrap gap-3">
                {order.latest_build.play_store_url ? (
                  <a
                    className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600"
                    href={order.latest_build.play_store_url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Ouvrir Google Play
                  </a>
                ) : null}
                {order.latest_build.app_store_url ? (
                  <a
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-200"
                    href={order.latest_build.app_store_url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Ouvrir App Store
                  </a>
                ) : null}
              </div>
            ) : null}
          </SectionCard>
        );
      })}
    </div>
  );
}
