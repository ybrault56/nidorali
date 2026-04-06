"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { SectionCard, cn } from "@nidorali/ui";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { organizationStepSchema } from "../../lib/validations";
import { useConfiguratorStore, type OrganizationType } from "../../store/configurator";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const organizationOptions: Array<{
  description: string;
  label: string;
  value: OrganizationType;
}> = [
  { description: "TPE, PME, startup ou agence", label: "Entreprise", value: "entreprise" },
  { description: "Club, fédération ou communauté", label: "Association", value: "association" },
  { description: "Mairie, ville ou structure publique", label: "Collectivité", value: "collectivite" },
  { description: "Projet spécifique ou cas hybride", label: "Autre", value: "autre" },
];

/**
 * Première étape du tunnel client, centrée sur la structure porteuse du projet.
 *
 * @returns Formulaire d'entrée du tunnel de commande
 */
export function OrganizationStep() {
  const router = useRouter();
  const store = useConfiguratorStore();
  const form = useForm<z.infer<typeof organizationStepSchema>>({
    defaultValues: {
      billing_email: store.billing_email,
      organization_type: store.organization_type,
    },
    resolver: zodResolver(organizationStepSchema),
  });

  return (
    <SectionCard className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-brand-600">Étape 1 sur 4</p>
        <h1 className="text-balance text-3xl font-semibold text-slate-950">Parlez-nous de vous</h1>
        <p className="text-pretty text-sm text-slate-600">
          Quelle est la nature de votre structure ? Cela nous aide à cadrer votre application native Android + iOS.
        </p>
      </div>
      <form
        className="space-y-6"
        noValidate
        onSubmit={form.handleSubmit((values) => {
          store.setOrganization(values);
          router.push("/configure/modules");
        })}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {organizationOptions.map((option) => {
            const active = form.watch("organization_type") === option.value;
            return (
              <button
                aria-pressed={active}
                className={cn(
                  "rounded-[1.75rem] border p-5 text-left transition-colors duration-150 hover:border-brand-400",
                  active ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white",
                )}
                key={option.value}
                onClick={() => form.setValue("organization_type", option.value, { shouldValidate: true })}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-slate-950">{option.label}</p>
                    <p className="text-pretty text-sm text-slate-600">{option.description}</p>
                  </div>
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border",
                      active ? "border-brand-500 bg-brand-500 text-white" : "border-slate-200 bg-white text-slate-300",
                    )}
                  >
                    <Check className="size-4" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="billing_email">
            Email de contact
          </label>
          <Input
            aria-invalid={Boolean(form.formState.errors.billing_email)}
            id="billing_email"
            placeholder="contact@votre-structure.fr"
            type="email"
            {...form.register("billing_email")}
          />
          {form.formState.errors.billing_email ? (
            <p className="text-sm text-rose-600">{form.formState.errors.billing_email.message}</p>
          ) : (
            <p className="text-pretty text-xs text-slate-500">
              Cet email servira à la commande, au suivi client et aux notifications de mise en ligne.
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit">Continuer</Button>
        </div>
      </form>
    </SectionCard>
  );
}
