import { calculateMonthlyPrice } from "@nidorali/types";
import type { FastifyInstance } from "fastify";
import type Stripe from "stripe";

import { AppError } from "../../shared/errors.js";

/**
 * Crée une session Stripe Checkout pour un futur tenant.
 */
export async function createCheckoutSession(
  fastify: FastifyInstance,
  origin: string,
  payload: {
    app_name: string;
    billing_email: string;
    bundle_id: string;
    plan: "starter" | "pro" | "enterprise";
    slug: string;
    tenant_config: {
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
    };
  },
  customerAccountId: string,
) {
  if (fastify.env.NIDORALI_SIMULATION_MODE) {
    const tenant = await fastify.dataRepository.createTenantFromCheckout(payload, customerAccountId);
    const buildJob = await fastify.dataRepository.createBuildJob({
      platform: "both",
      tenant_id: tenant.id,
    });

    const response = await fetch(`${fastify.env.BUILD_SERVICE_URL}/internal/builds`, {
      body: JSON.stringify({
        build_job_id: buildJob.id,
        platform: "both",
        source: "simulation-checkout",
        tenant_id: tenant.id,
      }),
      headers: {
        "content-type": "application/json",
        "x-build-service-secret": fastify.env.BUILD_SERVICE_SECRET,
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new AppError({
        code: "simulation_build_trigger_failed",
        details: await response.text(),
        message: "Le build-service local n'a pas accepté la simulation.",
        statusCode: 502,
      });
    }

    return {
      checkoutSessionId: `sim_${buildJob.id}`,
      url: `${origin}/success?mode=simulation&session_id=sim_${buildJob.id}&tenant=${tenant.slug}`,
    };
  }

  const stripe = fastify.stripe as Stripe;
  const unitAmount = calculateMonthlyPrice(payload.tenant_config);
  const session = await stripe.checkout.sessions.create({
    cancel_url: `${origin}/configure/summary?cancelled=1`,
    customer_email: payload.billing_email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Nidorali ${payload.app_name}`,
          },
          recurring: {
            interval: "month",
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      app_name: payload.app_name,
      billing_email: payload.billing_email,
      bundle_id: payload.bundle_id,
      customer_account_id: customerAccountId,
      plan: payload.plan,
      slug: payload.slug,
      tenant_config_json: JSON.stringify(payload.tenant_config),
    },
    mode: "subscription",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  return {
    checkoutSessionId: session.id,
    url: session.url,
  };
}
