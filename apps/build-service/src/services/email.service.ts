import { Resend } from "resend";

import type { BuildServiceEnv } from "../config/index.js";

export interface EmailTemplateResult {
  html: string;
  subject: string;
}

/**
 * Rend le template de bienvenue.
 */
export function renderWelcomeEmail(appName: string, dashboardUrl: string): EmailTemplateResult {
  return {
    html: `<div style="font-family:Inter,Arial,sans-serif;background:#09101F;padding:32px;color:#F8FAFC"><h1 style="color:#0F62FE">Bienvenue sur Nidorali</h1><p>Votre commande pour <strong>${appName}</strong> est confirmée.</p><p>Accédez au dashboard : <a href="${dashboardUrl}" style="color:#A7D8FF">${dashboardUrl}</a></p></div>`,
    subject: `${appName} · commande confirmée`,
  };
}

/**
 * Rend le template Android prêt.
 */
export function renderAndroidReadyEmail(appName: string, playStoreUrl: string): EmailTemplateResult {
  return {
    html: `<div style="font-family:Inter,Arial,sans-serif;background:#09101F;padding:32px;color:#F8FAFC"><h1 style="color:#0F62FE">Android prêt</h1><p>${appName} est disponible sur Google Play.</p><p><a href="${playStoreUrl}" style="color:#A7D8FF">${playStoreUrl}</a></p></div>`,
    subject: `${appName} · Android prêt`,
  };
}

/**
 * Rend le template iOS prêt.
 */
export function renderIosReadyEmail(appName: string, appStoreUrl: string): EmailTemplateResult {
  return {
    html: `<div style="font-family:Inter,Arial,sans-serif;background:#09101F;padding:32px;color:#F8FAFC"><h1 style="color:#0F62FE">iOS prêt</h1><p>${appName} est disponible sur l'App Store.</p><p><a href="${appStoreUrl}" style="color:#A7D8FF">${appStoreUrl}</a></p></div>`,
    subject: `${appName} · iOS prêt`,
  };
}

/**
 * Rend le template de paiement échoué.
 */
export function renderPaymentFailedEmail(appName: string, billingUrl: string): EmailTemplateResult {
  return {
    html: `<div style="font-family:Inter,Arial,sans-serif;background:#09101F;padding:32px;color:#F8FAFC"><h1 style="color:#0F62FE">Paiement échoué</h1><p>La facturation de ${appName} nécessite une mise à jour de carte bancaire.</p><p><a href="${billingUrl}" style="color:#A7D8FF">${billingUrl}</a></p></div>`,
    subject: `${appName} · paiement échoué`,
  };
}

/**
 * Envoie un email transactionnel via Resend.
 */
export async function sendTransactionalEmail(
  env: BuildServiceEnv,
  input: { html: string; subject: string; to: string },
) {
  if (env.NODE_ENV === "test") {
    return { id: "test-email" };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  return resend.emails.send({
    from: "Nidorali <noreply@nidorali.app>",
    html: input.html,
    subject: input.subject,
    to: input.to,
  });
}
