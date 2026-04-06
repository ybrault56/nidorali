"use client";

import { PageShell, SectionCard } from "@nidorali/ui";
import { useEffect, useState } from "react";

import { AdminGate } from "./AdminGate";
import { BuildStatus } from "./BuildStatus";
import { TenantActions } from "./TenantActions";
import { getAdminAccessToken } from "../../lib/admin-session";
import { getAdminTenant } from "../../lib/api";
import type { BuildJob, TenantBundle } from "../../types";

export interface AdminTenantDetailPageProps {
  tenantId: string;
}

/**
 * Affiche le detail d'un tenant dans le back-office.
 *
 * @param props - Identifiant du tenant a charger
 * @returns Vue detaillee du tenant et de ses builds
 */
export function AdminTenantDetailPage({ tenantId }: AdminTenantDetailPageProps) {
  const [detail, setDetail] = useState<(TenantBundle & { buildJobs: BuildJob[] }) | null>(null);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    let active = true;
    const loadTenant = async () => {
      const token = await getAdminAccessToken();
      if (!token || !active) {
        return;
      }

      setAccessToken(token);
      setDetail(await getAdminTenant(tenantId, token));
    };

    void loadTenant();
    const interval = window.setInterval(() => {
      void loadTenant();
    }, 3_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [tenantId]);

  return (
    <PageShell>
      <AdminGate>
        <SectionCard className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-balance text-3xl font-semibold text-slate-950">{detail?.app_name ?? "Tenant"}</h1>
              <p className="text-sm text-slate-600">{detail?.bundle_id}</p>
            </div>
            {detail ? <TenantActions accessToken={accessToken} tenantId={detail.id} /> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Plan</p>
              <p className="mt-2 text-xl font-semibold text-slate-950 capitalize">{detail?.plan ?? "-"}</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Builds</p>
              <div className="mt-3 space-y-2">
                {detail?.buildJobs.map((build) => (
                  <div className="flex items-center justify-between" key={build.id}>
                    <span className="text-sm text-slate-700">{build.platform}</span>
                    <BuildStatus status={build.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </AdminGate>
    </PageShell>
  );
}
