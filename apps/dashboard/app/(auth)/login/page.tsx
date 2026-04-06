"use client";

import { PageShell, SectionCard } from "@nidorali/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabaseBrowserClient } from "../../../lib/supabase";
import { isDashboardSimulationMode } from "../../../lib/admin-session";
import { Logo } from "../../../components/shared/Logo";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

/**
 * Page de connexion admin Nidorali.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isDashboardSimulationMode) {
    return (
      <PageShell contentClassName="max-w-lg">
        <SectionCard className="space-y-6">
          <Logo />
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-semibold text-slate-950">Connexion admin</h1>
            <p className="text-pretty text-sm text-slate-600">
              Le dashboard fonctionne en mode simulation locale. Le back-office est accessible sans session Supabase réelle.
            </p>
          </div>
          <Button className="w-full" onClick={() => router.push("/admin/tenants")}>
            Ouvrir le back-office local
          </Button>
        </SectionCard>
      </PageShell>
    );
  }

  return (
    <PageShell contentClassName="max-w-lg">
      <SectionCard className="space-y-6">
        <Logo />
        <div className="space-y-2">
          <h1 className="text-balance text-3xl font-semibold text-slate-950">Connexion admin</h1>
          <p className="text-pretty text-sm text-slate-600">Utilisez votre session Supabase `super_admin` pour accéder au back-office.</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const result = await supabaseBrowserClient.auth.signInWithPassword({ email, password });
            if (result.error) {
              setError(result.error.message);
              return;
            }
            router.push("/admin/tenants");
          }}
        >
          <Input onChange={(event) => setEmail(event.target.value)} placeholder="admin@nidorali.app" type="email" value={email} />
          <Input onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" type="password" value={password} />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button className="w-full" type="submit">
            Se connecter
          </Button>
        </form>
      </SectionCard>
    </PageShell>
  );
}
