import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  Cloud,
  Rocket,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PageShell, SectionCard } from "@nidorali/ui";
import Link from "next/link";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
const serviceCards = [
  { color: "bg-[#E7DFF7] text-[#6336C9]", icon: Briefcase, title: "Conception" },
  { color: "bg-[#F8DDDD] text-[#B23B2E]", icon: Smartphone, title: "Développement mobile" },
  { color: "bg-[#DDECF8] text-[#005A93]", icon: Rocket, title: "Déploiement Android & iOS" },
  { color: "bg-[#F7E8D0] text-[#B76712]", icon: ShieldCheck, title: "Maintenance & Sécurité" },
  { color: "bg-[#DDF3E3] text-[#1F7A45]", icon: BarChart3, title: "Données & Statistiques" },
  { color: "bg-[#FBF2B8] text-[#8A6500]", icon: Cloud, title: "Hébergement" },
];

const faqItems = [
  {
    answer: "Nous concevons, développons et publions une application mobile native Android + iOS adaptée à votre structure.",
    question: "Quels services propose Nidorali ?",
  },
  {
    answer: "Nous pouvons préparer votre app en moins de 24h, puis les validations finales dépendent d'Apple et Google.",
    question: "Combien de temps avant la mise en ligne ?",
  },
  {
    answer: "Votre abonnement couvre l'hébergement, la maintenance corrective et le suivi du déploiement.",
    question: "Que couvre l'abonnement ?",
  },
];

/**
 * Landing page publique inspirée de la démo Nidorali.
 *
 * @returns Parcours marketing d'entrée vers le configurateur
 */
export function LandingPage() {
  return (
    <PageShell contentClassName="gap-10">
      <SiteHeader ctaHref="/configure/branding" ctaLabel="Tester maintenant" />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_360px]" id="accueil">
        <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-8">
          <p className="text-sm font-semibold uppercase text-brand-300">Applications mobiles sur mesure</p>
          <h1 className="text-balance text-5xl font-semibold text-brand-300 sm:text-6xl">
            Faites une pause ! Nous nous occupons de tout.
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-slate-200">
            Nidorali transforme votre besoin en application native Android + iOS, avec design, publication stores, maintenance
            et hébergement inclus.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600" href="/configure/branding">
              Commander mon application
            </Link>
            <Link className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-200" href="/orders">
              Suivre ma commande
            </Link>
          </div>
        </div>
        <SectionCard className="space-y-5 bg-white">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-brand-600">Parcours client</p>
            <h2 className="text-balance text-2xl font-semibold text-slate-950">De la commande au store</h2>
          </div>
          <div className="grid gap-3">
            {[
              "1. Configuration en ligne avec aperçu immédiat",
              "2. Proposition de prix et création de compte client",
              "3. Déclenchement du build Android + iOS",
              "4. Suivi de l'avancement jusqu'aux stores",
            ].map((item) => (
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700" key={item}>
                {item}
              </div>
            ))}
          </div>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600" href="/configure/branding">
            Voir la démo <ArrowRight className="size-4" />
          </Link>
        </SectionCard>
      </section>

      <section className="space-y-6" id="services">
        <h2 className="text-balance text-4xl font-semibold text-brand-300">Faites une pause ! Nous nous occupons de tout.</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map((card) => (
            <div className={`rounded-[2rem] p-8 ${card.color}`} key={card.title}>
              <card.icon className="size-12" />
              <p className="mt-16 text-balance text-3xl font-semibold">{card.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2" id="vision">
        <SectionCard className="space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Building2 className="size-8" />
          </div>
          <h2 className="text-balance text-3xl font-semibold text-slate-950">Notre vision</h2>
          <p className="text-pretty text-sm text-slate-600">
            Tout le monde a un smartphone, mais les applications mobiles restent trop chères à produire. Nidorali rend enfin
            l&apos;app native accessible grâce à un socle mutualisé, un design sur mesure et un accompagnement complet.
          </p>
        </SectionCard>
        <SectionCard className="space-y-4">
          <p className="text-xs font-semibold uppercase text-brand-600">Positionnement</p>
          <h2 className="text-balance text-3xl font-semibold text-slate-950">La valeur ajoutée, c&apos;est le natif</h2>
          <p className="text-pretty text-sm text-slate-600">
            Le différenciateur Nidorali vient de la livraison d&apos;une vraie app Android + iOS, pensée pour les stores,
            industrialisée et suivie dans le temps.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Android</p>
              <p className="mt-1 text-sm text-slate-600">Package natif, icône, publication Play Store.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">iOS</p>
              <p className="mt-1 text-sm text-slate-600">Bundle natif, validation App Store, suivi de review.</p>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2" id="tarifs">
        <SectionCard className="space-y-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Solutions traditionnelles</p>
          <p className="text-5xl font-semibold text-slate-950">10 000 €</p>
          <ul className="space-y-2 text-pretty text-sm text-slate-600">
            <li>Application sur mesure coûteuse</li>
            <li>Délais longs et publication complexe</li>
            <li>Maintenance et hébergement en plus</li>
          </ul>
        </SectionCard>
        <SectionCard className="space-y-4 border-brand-200 bg-brand-50">
          <p className="text-xs font-semibold uppercase text-brand-700">Solution Nidorali</p>
          <p className="text-5xl font-semibold text-slate-950">10 €*</p>
          <ul className="space-y-2 text-pretty text-sm text-slate-700">
            <li>2000x moins cher, avec une app native Android + iOS</li>
            <li>Déploiement rapide et suivi client en ligne</li>
            <li>* À partir de 10 €/mois</li>
          </ul>
          <Link className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600" href="/configure/branding">
            Commander maintenant
          </Link>
        </SectionCard>
      </section>

      <section className="space-y-4" id="faq">
        <h2 className="text-balance text-4xl font-semibold text-brand-300">FAQs</h2>
        <div className="grid gap-4">
          {faqItems.map((item) => (
            <SectionCard className="space-y-2" key={item.question}>
              <h3 className="text-balance text-xl font-semibold text-slate-950">{item.question}</h3>
              <p className="text-pretty text-sm text-slate-600">{item.answer}</p>
            </SectionCard>
          ))}
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
