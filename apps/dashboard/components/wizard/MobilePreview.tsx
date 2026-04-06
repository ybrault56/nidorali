"use client";

import { MODULE_DEFINITIONS } from "@nidorali/types";

import { useConfiguratorStore } from "../../store/configurator";

/**
 * Mock mobile live alimenté par le store Zustand.
 */
export function MobilePreview() {
  const state = useConfiguratorStore();
  const activeModules = MODULE_DEFINITIONS.filter((module) => state[module.key]);
  const visibleModules = activeModules.slice(0, 4);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 lg:sticky lg:top-8">
      <div className="mb-4 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
        <div>
          <p className="text-xs uppercase text-slate-400">Aperçu live</p>
          <p className="font-semibold text-white">{activeModules.length} modules actifs</p>
        </div>
        <p className="text-right text-xs text-slate-300">
          {state.max_users.toLocaleString("fr-FR")}
          <br />
          utilisateurs
        </p>
      </div>
      <div className="mx-auto w-full max-w-[290px] rounded-[2.25rem] border border-white/10 bg-slate-950 p-4 shadow-card">
        <div className="rounded-[1.75rem] bg-white p-4">
          <div className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white" style={{ backgroundColor: state.primary_color }}>
            {state.logo_url ? (
              <img alt="Logo app" className="size-10 rounded-2xl object-cover" src={state.logo_url} />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white/20 text-sm font-semibold">
                {state.app_name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs opacity-80">Aperçu mobile</p>
              <p className="text-base font-semibold">{state.app_name}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {visibleModules.map((module) => (
              <div
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                key={module.key}
              >
                <span>{module.label}</span>
                <span className="size-2 rounded-full" style={{ backgroundColor: state.secondary_color }} />
              </div>
            ))}
            {activeModules.length > visibleModules.length ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                + {activeModules.length - visibleModules.length} autres modules
              </div>
            ) : null}
          </div>
          <button
            className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: state.primary_color }}
            type="button"
          >
            Voir l&apos;expérience membre
          </button>
        </div>
      </div>
    </div>
  );
}
