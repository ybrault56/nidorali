import type { InMemorySeed } from "./repository.js";

const DEMO_TENANT_ID = "11111111-1111-1111-1111-111111111111";
const DEMO_FORM_ID = "22222222-2222-2222-2222-222222222222";
const DEMO_EVENT_ID = "33333333-3333-3333-3333-333333333333";
const DEMO_NEWS_ID = "44444444-4444-4444-4444-444444444444";
const DEMO_DOCUMENT_ID = "55555555-5555-5555-5555-555555555555";
const DEMO_BUILD_ID = "66666666-6666-6666-6666-666666666666";
const DEMO_CONFIG_ID = "77777777-7777-7777-7777-777777777777";

/**
 * Construit les données locales de démonstration utilisées en simulation.
 *
 * @returns Seed mémoire exploitable pour les tests manuels
 */
export function createSimulationSeed(): InMemorySeed {
  const timestamp = new Date().toISOString();

  return {
    buildJobs: [
      {
        android_artifact_url: "https://local.nidorali.test/artifacts/demo-club-android.apk",
        app_store_url: "https://local.nidorali.test/stores/demo-club-ios",
        completed_at: timestamp,
        created_at: timestamp,
        eas_build_id_android: "sim-android-demo",
        eas_build_id_ios: "sim-ios-demo",
        error_message: null,
        id: DEMO_BUILD_ID,
        ios_artifact_url: "https://local.nidorali.test/artifacts/demo-club-ios.ipa",
        play_store_url: "https://local.nidorali.test/stores/demo-club-android",
        platform: "both",
        started_at: timestamp,
        status: "done",
        tenant_id: DEMO_TENANT_ID,
      },
    ],
    documents: [
      {
        category: "Onboarding",
        created_at: timestamp,
        file_size: 128_000,
        file_type: "application/pdf",
        file_url: "https://local.nidorali.test/files/guide-demarrage.pdf",
        id: DEMO_DOCUMENT_ID,
        name: "Guide de démarrage",
        tenant_id: DEMO_TENANT_ID,
        uploaded_by: null,
      },
    ],
    events: [
      {
        color: "#0F62FE",
        created_at: timestamp,
        created_by: null,
        description: "Présentation locale du portail white-label.",
        end_at: new Date(Date.now() + 3_600_000).toISOString(),
        id: DEMO_EVENT_ID,
        is_all_day: false,
        location: "Visio locale",
        max_attendees: 50,
        start_at: new Date(Date.now() + 1_800_000).toISOString(),
        tenant_id: DEMO_TENANT_ID,
        title: "Kick-off Nidorali",
      },
    ],
    forms: [
      {
        created_at: timestamp,
        description: "Collecte les besoins d'onboarding du client.",
        fields: [
          {
            id: "company-name",
            label: "Nom de la structure",
            placeholder: "Agence Nova",
            required: true,
            type: "text",
          },
          {
            id: "target-go-live",
            label: "Date cible de mise en ligne",
            required: true,
            type: "date",
          },
        ],
        id: DEMO_FORM_ID,
        is_active: true,
        tenant_id: DEMO_TENANT_ID,
        title: "Brief de lancement",
      },
    ],
    news: [
      {
        author_id: null,
        content: "La démo locale Nidorali est prête pour les tests end-to-end.",
        cover_url: null,
        created_at: timestamp,
        id: DEMO_NEWS_ID,
        is_published: true,
        published_at: timestamp,
        tenant_id: DEMO_TENANT_ID,
        title: "Simulation locale disponible",
      },
    ],
    tenants: [
      {
        app_name: "Club Démo",
        bundle_id: "com.nidorali.democlub",
        config: {
          created_at: timestamp,
          font: "Inter",
          id: DEMO_CONFIG_ID,
          logo_url: null,
          max_users: 500,
          module_documents: true,
          module_forms: true,
          module_map: true,
          module_members: true,
          module_messaging: true,
          module_news: true,
          module_notifications: true,
          module_planning: true,
          primary_color: "#0F62FE",
          secondary_color: "#A7D8FF",
          splash_bg_color: "#FFFFFF",
          tenant_id: DEMO_TENANT_ID,
          updated_at: timestamp,
        },
        contact_email: "contact@demo.test",
        created_at: timestamp,
        id: DEMO_TENANT_ID,
        plan: "pro",
        slug: "demo-club",
        status: "live",
        stripe_customer_id: null,
        stripe_subscription_id: null,
        updated_at: timestamp,
      },
    ],
  };
}
