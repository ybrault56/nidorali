"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SectionCard } from "@nidorali/ui";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { identityStepSchema } from "../../lib/validations";
import { useConfiguratorStore } from "../../store/configurator";
import { ColorPicker } from "../shared/ColorPicker";
import { LogoUploader } from "../shared/LogoUploader";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

/**
 * Étape identité visuelle du tunnel client.
 *
 * @returns Nom d'app, logo et palette visuelle
 */
export function IdentityStep() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const form = useForm<z.infer<typeof identityStepSchema>>({
    defaultValues: {
      app_name: store.app_name,
      logo_url: store.logo_url,
      primary_color: store.primary_color,
      secondary_color: store.secondary_color,
      splash_bg_color: store.splash_bg_color,
    },
    resolver: zodResolver(identityStepSchema),
  });
  const errors = form.formState.errors;

  return (
    <SectionCard className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-brand-600">Étape 3 sur 4</p>
        <h1 className="text-balance text-3xl font-semibold text-slate-950">Nom & identité visuelle</h1>
        <p className="text-pretty text-sm text-slate-600">
          Donnez un nom à votre application, ajoutez votre logo si vous l&apos;avez déjà et ajustez la palette de base.
        </p>
      </div>
      <form
        className="space-y-6"
        noValidate
        onSubmit={form.handleSubmit((values) => {
          store.setBranding(values);
          router.push("/configure/summary");
        })}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="app_name">
            Nom de l&apos;application
          </label>
          <Input aria-invalid={Boolean(errors.app_name)} id="app_name" placeholder="Mon application" {...form.register("app_name")} />
          {errors.app_name ? <p className="text-sm text-rose-600">{errors.app_name.message}</p> : null}
        </div>
        <LogoUploader onChange={(value) => form.setValue("logo_url", value, { shouldValidate: true })} value={form.watch("logo_url")} />
        <div className="grid gap-4 md:grid-cols-3">
          <ColorPicker label="Couleur principale" onChange={(value) => form.setValue("primary_color", value, { shouldValidate: true })} value={form.watch("primary_color")} />
          <ColorPicker label="Couleur secondaire" onChange={(value) => form.setValue("secondary_color", value, { shouldValidate: true })} value={form.watch("secondary_color")} />
          <ColorPicker label="Fond splash" onChange={(value) => form.setValue("splash_bg_color", value, { shouldValidate: true })} value={form.watch("splash_bg_color")} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Slug généré</p>
            <p className="mt-2 text-sm font-semibold text-slate-950">{store.slug}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Bundle généré</p>
            <p className="mt-2 break-all text-sm font-semibold text-slate-950">{store.bundle_id}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Police standard</p>
            <p className="mt-2 text-sm font-semibold text-slate-950">{store.font}</p>
          </div>
        </div>
        <div className="flex justify-between gap-3">
          <Button onClick={() => router.push("/configure/modules")} variant="secondary">
            Retour
          </Button>
          <Button type="submit">Voir l&apos;aperçu</Button>
        </div>
      </form>
    </SectionCard>
  );
}
