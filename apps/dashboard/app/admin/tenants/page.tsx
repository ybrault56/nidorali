"use client";

import { PageShell, SectionCard } from "@nidorali/ui";
import { useEffect, useState } from "react";

import { AdminGate } from "../../../components/admin/AdminGate";
import { TenantTable } from "../../../components/admin/TenantTable";
import { Logo } from "../../../components/shared/Logo";
import { getAdminAccessToken } from "../../../lib/admin-session";
import { listAdminTenants } from "../../../lib/api";
import type { TenantBundle } from "../../../types";

/**
 * Liste des tenants du back-office.
 */
export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<TenantBundle[]>([]);

  useEffect(() => {
    let active = true;
    const loadTenants = async () => {
      const accessToken = await getAdminAccessToken();
      if (!accessToken || !active) {
        return;
      }

      setTenants(await listAdminTenants(accessToken));
    };

    void loadTenants();
    const interval = window.setInterval(() => {
      void loadTenants();
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
          <Logo />
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-semibold text-slate-950">Tenants</h1>
            <p className="text-sm text-slate-600">Suivi des configurations, plans et statuts de provisioning.</p>
          </div>
          <TenantTable tenants={tenants} />
        </SectionCard>
      </AdminGate>
    </PageShell>
  );
}
