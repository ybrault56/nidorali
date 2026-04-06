"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SectionCard, cn } from "@nidorali/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { customerAuthSchema } from "../../lib/validations";
import { loginCustomerAccount, registerCustomerAccount } from "../../lib/api";
import { useCustomerSessionStore } from "../../store/customer-session";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface CustomerAuthCardProps {
  defaultMode?: "login" | "register";
  description: string;
  email: string;
  onEmailChange: (email: string) => void;
  onSuccess?: () => void;
  title: string;
}

/**
 * Gère la création ou la connexion du compte client dans le parcours de commande.
 *
 * @param props - Libellés et callbacks d'intégration
 * @returns Carte d'authentification client réutilisable
 */
export function CustomerAuthCard({
  defaultMode = "register",
  description,
  email,
  onEmailChange,
  onSuccess,
  title,
}: CustomerAuthCardProps) {
  const setSession = useCustomerSessionStore((state) => state.setSession);
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof customerAuthSchema>>({
    defaultValues: {
      display_name: "",
      email,
      password: "",
    },
    resolver: zodResolver(customerAuthSchema),
  });

  return (
    <SectionCard className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-brand-600">Compte client</p>
        <h2 className="text-balance text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="text-pretty text-sm text-slate-600">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-[1.5rem] bg-slate-100 p-1">
        {(["register", "login"] as const).map((candidate) => (
          <button
            className={cn(
              "rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition-colors duration-150",
              mode === candidate ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900",
            )}
            key={candidate}
            onClick={() => {
              setMode(candidate);
              setError(null);
            }}
            type="button"
          >
            {candidate === "register" ? "Créer mon accès" : "J'ai déjà un compte"}
          </button>
        ))}
      </div>
      <form
        className="space-y-4"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          setLoading(true);
          setError(null);
          try {
            const payload =
              mode === "register"
                ? await registerCustomerAccount(values)
                : await loginCustomerAccount({
                    email: values.email,
                    password: values.password,
                  });

            setSession({
              account: payload.account,
              token: payload.token.accessToken,
            });
            onEmailChange(payload.account.email);
            onSuccess?.();
          } catch (authError) {
            setError(authError instanceof Error ? authError.message : "La session client n'a pas pu être ouverte.");
          } finally {
            setLoading(false);
          }
        })}
      >
        {mode === "register" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="display_name">
              Nom complet
            </label>
            <Input
              aria-invalid={Boolean(form.formState.errors.display_name)}
              id="display_name"
              placeholder="Kilfen Baridon"
              {...form.register("display_name")}
            />
            {form.formState.errors.display_name ? (
              <p className="text-sm text-rose-600">{form.formState.errors.display_name.message}</p>
            ) : null}
          </div>
        ) : null}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="customer_email">
            Email
          </label>
          <Input
            aria-invalid={Boolean(form.formState.errors.email)}
            id="customer_email"
            placeholder="contact@nidorali.com"
            type="email"
            {...form.register("email", {
              onChange: (event) => onEmailChange(event.target.value),
            })}
          />
          {form.formState.errors.email ? <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="customer_password">
            Mot de passe
          </label>
          <Input
            aria-invalid={Boolean(form.formState.errors.password)}
            id="customer_password"
            placeholder="Minimum 8 caractères"
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-rose-600">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Connexion en cours..." : mode === "register" ? "Créer mon compte" : "Me connecter"}
        </Button>
      </form>
    </SectionCard>
  );
}
