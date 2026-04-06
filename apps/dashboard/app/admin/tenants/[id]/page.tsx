export const dynamic = "force-dynamic";

import { AdminTenantDetailPage } from "../../../../components/admin/AdminTenantDetailPage";

/**
 * Détail d'un tenant.
 */
export default function AdminTenantDetailRoute({ params }: { params: { id: string } }) {
  return <AdminTenantDetailPage tenantId={params.id} />;
}
