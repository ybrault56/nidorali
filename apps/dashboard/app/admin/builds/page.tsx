"use client";

import { PageShell, SectionCard } from "@nidorali/ui";
import { useEffect, useState } from "react";

import { AdminGate } from "../../../components/admin/AdminGate";
import { BuildStatus } from "../../../components/admin/BuildStatus";
import { getAdminAccessToken } from "../../../lib/admin-session";
import { listAdminBuilds } from "../../../lib/api";
import type { BuildJob } from "../../../types";

/**
 * Historique global des builds.
 */
export default function AdminBuildsPage() {
  const [builds, setBuilds] = useState<BuildJob[]>([]);

  useEffect(() => {
    let active = true;
    const loadBuilds = async () => {
      const accessToken = await getAdminAccessToken();
      if (!accessToken || !active) {
        return;
      }

      setBuilds(await listAdminBuilds(accessToken));
    };

    void loadBuilds();
    const interval = window.setInterval(() => {
      void loadBuilds();
    }, 3_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <PageShell>
      <AdminGate>
        <SectionCard className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-semibold text-slate-950">Historique des builds</h1>
            <p className="text-sm text-slate-600">Vue centralisée de la queue et des soumissions store.</p>
          </div>
          <div className="space-y-3">
            {builds.map((build) => (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4" key={build.id}>
                <div>
                  <p className="font-semibold text-slate-900">{build.tenant_id}</p>
                  <p className="text-sm text-slate-500">{build.platform}</p>
                </div>
                <BuildStatus status={build.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      </AdminGate>
    </PageShell>
  );
}
