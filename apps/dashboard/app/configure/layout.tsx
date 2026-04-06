"use client";

import { PageShell } from "@nidorali/ui";

import { SiteHeader } from "../../components/marketing/SiteHeader";
import { Logo } from "../../components/shared/Logo";
import { ConfiguratorPreview } from "../../components/wizard/ConfiguratorPreview";
import { WizardNav } from "../../components/wizard/WizardNav";
import { formatPriceEur } from "../../lib/pricing";
import { useConfiguratorStore } from "../../store/configurator";

/**
 * Layout partagé du configurateur.
 */
export default function ConfigureLayout({ children }: { children: React.ReactNode }) {
  const store = useConfiguratorStore();

  return (
    <PageShell contentClassName="gap-8">
      <SiteHeader ctaHref="/orders" ctaLabel="Suivi client" />
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="text-pretty text-sm text-slate-300">Configurateur white-label</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-4 py-3">
            <p className="text-xs uppercase text-slate-400">Application</p>
            <p className="mt-1 text-base font-semibold text-white">{store.app_name}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-4 py-3">
            <p className="text-xs uppercase text-slate-400">Total mensuel</p>
            <p className="mt-1 text-base font-semibold text-white">{formatPriceEur(store.getMonthlyPrice())}</p>
          </div>
        </div>
      </div>
      <WizardNav />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="order-2 lg:order-1">{children}</div>
        <div className="order-1 lg:order-2">
          <ConfiguratorPreview />
        </div>
      </div>
    </PageShell>
  );
}
