"use client";

import { useState } from "react";

import { triggerBuild } from "../../lib/api";
import { Button } from "../ui/Button";

/**
 * Actions rapides du back-office tenant.
 */
export function TenantActions({ accessToken, tenantId }: { accessToken: string; tenantId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await triggerBuild(tenantId, accessToken);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Build en cours..." : "Relancer le build"}
    </Button>
  );
}
