"use client";

import { useEffect, useState } from "react";

import { hasAdminSession, isDashboardSimulationMode } from "../../lib/admin-session";
import { Button } from "../ui/Button";

/**
 * Garde d'accès simple pour le back-office admin.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void hasAdminSession().then((hasSession) => {
      setAuthorized(hasSession);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Vérification de session…</p>;
  }

  if (!authorized) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-slate-800">
        <p className="text-pretty text-sm">
          {isDashboardSimulationMode
            ? "Le mode simulation local n'est pas initialisé correctement."
            : "Une session administrateur Supabase est requise pour accéder au back-office."}
        </p>
        <Button className="mt-4" onClick={() => (window.location.href = "/login")}>
          Se connecter
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
