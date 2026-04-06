"use client";

import { PageShell, SectionCard } from "@nidorali/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Logo } from "../../../components/shared/Logo";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { isDashboardSimulationMode } from "../../../lib/admin-session";
import { supabaseBrowserClient } from "../../../lib/supabase";

/**
 * Page d'inscription admin Nidorali.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  if (isDashboardSimulationMode) {
    return (
      <PageShell contentClassName="max-w-lg">
        <SectionCard className="space-y-6">
          <Logo />
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-semibold text-slate-950">Compte admin simulé</h1>
            <p className="text-pretty text-sm text-slate-600">
              En local, aucun compte Supabase n&apos;est nécessaire. Utilisez directement le back-office pour valider le parcours admin.
            </p>
          </div>
          <Button className="w-full" onClick={() => router.push("/admin/tenants")}>
            Accéder au back-office
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
          <h1 className="text-balance text-3xl font-semibold text-slate-950">Créer un compte admin</h1>
          <p className="text-pretty text-sm text-slate-600">Le rôle `super_admin` reste géré via `app_metadata` dans Supabase.</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const result = await supabaseBrowserClient.auth.signUp({ email, password });
            setMessage(result.error ? result.error.message : "Compte créé, vérifiez votre email.");
            if (!result.error) {
              router.push("/login");
            }
          }}
        >
          <Input onChange={(event) => setEmail(event.target.value)} placeholder="admin@nidorali.app" type="email" value={email} />
          <Input onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" type="password" value={password} />
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          <Button className="w-full" type="submit">
            Créer le compte
          </Button>
        </form>
      </SectionCard>
    </PageShell>
  );
}
