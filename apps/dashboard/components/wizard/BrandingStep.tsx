"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SectionCard } from "@nidorali/ui";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { brandingStepSchema } from "../../lib/validations";
import { useConfiguratorStore } from "../../store/configurator";
import { ColorPicker } from "../shared/ColorPicker";
import { LogoUploader } from "../shared/LogoUploader";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

/**
 * Étape branding du configurateur.
 */
export function BrandingStep() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const form = useForm<z.infer<typeof brandingStepSchema>>({
    defaultValues: {
      app_name: store.app_name,
      billing_email: store.billing_email,
      bundle_id: store.bundle_id,
      font: store.font,
      logo_url: store.logo_url,
      primary_color: store.primary_color,
      secondary_color: store.secondary_color,
      slug: store.slug,
      splash_bg_color: store.splash_bg_color,
    },
    resolver: zodResolver(brandingStepSchema),
  });
  const errors = form.formState.errors;

  return (
    <SectionCard>
      <form
        className="grid gap-5"
        noValidate
        onSubmit={form.handleSubmit((values) => {
          store.setBranding(values);
          router.push("/configure/modules");
        })}
      >
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-semibold text-slate-950">Définissez l’identité de votre application.</h1>
            <p className="text-pretty text-sm text-slate-600">
              Logo, couleurs, nom d’application et bundle ID alimentent ensuite le dashboard, le mobile et le pipeline de build.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm font-medium text-slate-700">
              <label htmlFor="app_name">Nom de l’app</label>
              <Input aria-invalid={Boolean(errors.app_name)} {...form.register("app_name")} id="app_name" />
              {errors.app_name ? <p className="text-sm text-rose-600">{errors.app_name.message}</p> : null}
            </div>
            <div className="space-y-2 text-sm font-medium text-slate-700">
              <label htmlFor="billing_email">Email de facturation</label>
              <Input aria-invalid={Boolean(errors.billing_email)} {...form.register("billing_email")} id="billing_email" type="email" />
              {errors.billing_email ? <p className="text-sm text-rose-600">{errors.billing_email.message}</p> : null}
            </div>
            <div className="space-y-2 text-sm font-medium text-slate-700">
              <label htmlFor="slug">Slug</label>
              <Input aria-invalid={Boolean(errors.slug)} {...form.register("slug")} id="slug" />
              <p className="text-pretty text-xs text-slate-500">Utilisez uniquement des lettres minuscules, chiffres et tirets.</p>
              {errors.slug ? <p className="text-sm text-rose-600">{errors.slug.message}</p> : null}
            </div>
            <div className="space-y-2 text-sm font-medium text-slate-700">
              <label htmlFor="bundle_id">Bundle ID</label>
              <Input aria-invalid={Boolean(errors.bundle_id)} {...form.register("bundle_id")} id="bundle_id" />
              <p className="text-pretty text-xs text-slate-500">Exemple : `com.nidorali.monclient`.</p>
              {errors.bundle_id ? <p className="text-sm text-rose-600">{errors.bundle_id.message}</p> : null}
            </div>
            <div className="space-y-2 text-sm font-medium text-slate-700">
              <label htmlFor="font">Police</label>
              <Input aria-invalid={Boolean(errors.font)} {...form.register("font")} id="font" />
              {errors.font ? <p className="text-sm text-rose-600">{errors.font.message}</p> : null}
            </div>
          </div>
          <LogoUploader onChange={(value) => form.setValue("logo_url", value)} value={form.watch("logo_url")} />
          <div className="grid gap-4 md:grid-cols-3">
            <ColorPicker label="Couleur primaire" onChange={(value) => form.setValue("primary_color", value)} value={form.watch("primary_color")} />
            <ColorPicker label="Couleur secondaire" onChange={(value) => form.setValue("secondary_color", value)} value={form.watch("secondary_color")} />
            <ColorPicker label="Fond splash" onChange={(value) => form.setValue("splash_bg_color", value)} value={form.watch("splash_bg_color")} />
          </div>
          {(errors.primary_color || errors.secondary_color || errors.splash_bg_color || errors.logo_url) ? (
            <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Vérifiez les champs de branding avant de continuer.
            </div>
          ) : null}
        <div className="flex justify-end">
          <Button type="submit">Continuer</Button>
        </div>
      </form>
    </SectionCard>
  );
}
