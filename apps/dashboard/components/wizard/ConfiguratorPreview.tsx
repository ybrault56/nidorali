"use client";

import { MODULE_DEFINITIONS } from "@nidorali/types";

import { useConfiguratorStore } from "../../store/configurator";

/**
 * Aperçu temps réel du rendu mobile dans le tunnel client.
 *
 * @returns Maquette live de l'application commandée
 */
export function ConfiguratorPreview() {
  const state = useConfiguratorStore();
  const activeModules = MODULE_DEFINITIONS.filter((module) => state[module.key]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 lg:sticky lg:top-8">
      <div className="mb-4 rounded-[1.5rem] border border-white/10 bg-slate-950/50 px-4 py-4">
        <p className="text-xs uppercase text-slate-400">Aperçu</p>
        <p className="mt-2 text-lg font-semibold text-white">{state.app_name}</p>
        <p className="mt-1 text-sm text-slate-300">{state.max_users.toLocaleString("fr-FR")} utilisateurs</p>
      </div>
      <div className="mx-auto w-full max-w-[294px] rounded-[2.25rem] border border-white/10 bg-slate-950 p-4 shadow-card">
        <div className="rounded-[1.9rem] bg-white p-4">
          <div className="rounded-[1.5rem] px-4 py-4 text-white" style={{ backgroundColor: state.primary_color }}>
            <div className="flex items-center gap-3">
              {state.logo_url ? (
                <img alt="Logo tenant" className="size-12 rounded-2xl object-cover" src={state.logo_url} />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 text-lg font-semibold">
                  {state.app_name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs opacity-80">Application native</p>
                <p className="text-base font-semibold">{state.app_name}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {activeModules.slice(0, 4).map((module) => (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700" key={module.key}>
                <span>{module.label}</span>
                <span className="size-2 rounded-full" style={{ backgroundColor: state.secondary_color }} />
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: state.primary_color }}
            type="button"
          >
            Voir l&apos;expérience
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
          <p className="font-semibold text-white">Android + iOS</p>
          <p className="mt-1 text-pretty text-slate-300">La valeur Nidorali est bien la création et le déploiement de l&apos;app native sur les stores.</p>
        </div>
      </div>
    </div>
  );
}
