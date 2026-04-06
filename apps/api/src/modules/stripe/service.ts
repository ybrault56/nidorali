import type { FastifyInstance } from "fastify";
import type Stripe from "stripe";

import { AppError } from "../../shared/errors.js";

/**
 * Traite un événement Stripe vérifié.
 */
export async function handleStripeEvent(fastify: FastifyInstance, event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tenantConfigJson = session.metadata?.tenant_config_json;
    const appName = session.metadata?.app_name;
    const billingEmail = session.metadata?.billing_email;
    const bundleId = session.metadata?.bundle_id;
    const plan = session.metadata?.plan as "starter" | "pro" | "enterprise" | undefined;
    const slug = session.metadata?.slug;

    if (!tenantConfigJson || !appName || !billingEmail || !bundleId || !plan || !slug) {
      throw new AppError({
        code: "stripe_metadata_missing",
        message: "Métadonnées Checkout incomplètes.",
        statusCode: 400,
      });
    }

    const tenant = await fastify.dataRepository.createTenantFromCheckout({
      app_name: appName,
      billing_email: billingEmail,
      bundle_id: bundleId,
      plan,
      slug,
      tenant_config: JSON.parse(tenantConfigJson) as {
        font: string;
        logo_url: string | null;
        max_users: number;
        module_documents: boolean;
        module_forms: boolean;
        module_map: boolean;
        module_members: boolean;
        module_messaging: boolean;
        module_news: boolean;
        module_notifications: boolean;
        module_planning: boolean;
        primary_color: string;
        secondary_color: string;
        splash_bg_color: string;
      },
    });

    const buildJob = await fastify.dataRepository.createBuildJob({
      platform: "both",
      tenant_id: tenant.id,
    });

    await fetch(`${fastify.env.BUILD_SERVICE_URL}/internal/builds`, {
      body: JSON.stringify({
        build_job_id: buildJob.id,
        source: "stripe_webhook",
        tenant_id: tenant.id,
      }),
      headers: {
        "content-type": "application/json",
        "x-build-service-secret": fastify.env.BUILD_SERVICE_SECRET,
      },
      method: "POST",
    });

    return { handled: true, type: event.type };
  }

  return { handled: true, type: event.type };
}
