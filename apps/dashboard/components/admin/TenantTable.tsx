import Link from "next/link";
import type { TenantBundle } from "@nidorali/types";

import { Badge } from "../ui/Badge";

/**
 * Tableau de synthèse des tenants.
 */
export function TenantTable({ tenants }: { tenants: TenantBundle[] }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold">Tenant</th>
            <th className="px-4 py-3 font-semibold">Plan</th>
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 font-semibold">Modules</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr className="border-t border-slate-200" key={tenant.id}>
              <td className="px-4 py-3">
                <Link className="font-semibold text-brand-600 hover:text-brand-700" href={`/admin/tenants/${tenant.id}`}>
                  {tenant.app_name}
                </Link>
                <p className="text-xs text-slate-500">{tenant.slug}</p>
              </td>
              <td className="px-4 py-3 capitalize">{tenant.plan}</td>
              <td className="px-4 py-3">
                <Badge>{tenant.status}</Badge>
              </td>
              <td className="px-4 py-3 tabular-nums">
                {Object.values(tenant.config).filter((value) => value === true).length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
