import path from "node:path";

import { createClient } from "@supabase/supabase-js";
import type { TenantBundle } from "@nidorali/types";

import type { BuildServiceEnv } from "../config/index.js";
import { generateTenantAssets } from "../services/assets.service.js";
import { renderAndroidReadyEmail, renderIosReadyEmail, renderWelcomeEmail, sendTransactionalEmail } from "../services/email.service.js";
import { startEasBuild } from "../services/eas.service.js";
import type { BuildQueuePayload } from "../services/queue.service.js";
import { writeTenantManifest } from "../services/appjson.service.js";

/**
 * Exécute le pipeline complet d'un build tenant.
 */
export async function runBuildJob(env: BuildServiceEnv, payload: BuildQueuePayload) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await supabase
    .from("build_jobs")
    .update({ started_at: new Date().toISOString(), status: "processing" })
    .eq("id", payload.build_job_id);

  const tenantResult = await supabase.from("tenants").select("*").eq("id", payload.tenant_id).single();
  const configResult = await supabase.from("tenant_configs").select("*").eq("tenant_id", payload.tenant_id).single();
  const tenant = {
    ...(tenantResult.data as Omit<TenantBundle, "config">),
    config: configResult.data,
  } as TenantBundle;

  const manifestOutput = await writeTenantManifest(env, tenant);
  await generateTenantAssets({
    initials: tenant.app_name.slice(0, 2).toUpperCase(),
    logoUrl: tenant.config.logo_url,
    outDir: path.join(manifestOutput.outputDir, "assets"),
    primaryColor: tenant.config.primary_color,
    splashBackgroundColor: tenant.config.splash_bg_color,
  });

  if (tenant.contact_email) {
    const welcome = renderWelcomeEmail(tenant.app_name, "http://localhost:3000");
    await sendTransactionalEmail(env, {
      html: welcome.html,
      subject: welcome.subject,
      to: tenant.contact_email,
    });
  }

  await supabase.from("build_jobs").update({ status: "building" }).eq("id", payload.build_job_id);

  const mobileRoot = path.resolve(process.cwd(), env.MOBILE_APP_PATH);
  const androidBuild = payload.platform !== "ios" ? await startEasBuild(env, { manifestPath: manifestOutput.manifestPath, platform: "android", workingDirectory: mobileRoot }) : null;
  const iosBuild = payload.platform !== "android" ? await startEasBuild(env, { manifestPath: manifestOutput.manifestPath, platform: "ios", workingDirectory: mobileRoot }) : null;

  await supabase
    .from("build_jobs")
    .update({
      android_artifact_url: androidBuild?.artifactUrl ?? null,
      app_store_url: iosBuild?.storeUrl ?? null,
      completed_at: new Date().toISOString(),
      eas_build_id_android: androidBuild?.buildId ?? null,
      eas_build_id_ios: iosBuild?.buildId ?? null,
      ios_artifact_url: iosBuild?.artifactUrl ?? null,
      play_store_url: androidBuild?.storeUrl ?? null,
      status: "done",
    })
    .eq("id", payload.build_job_id);

  await supabase.from("tenants").update({ status: "live" }).eq("id", payload.tenant_id);

  if (tenant.contact_email && androidBuild) {
    const email = renderAndroidReadyEmail(tenant.app_name, androidBuild.storeUrl || androidBuild.artifactUrl);
    await sendTransactionalEmail(env, { html: email.html, subject: email.subject, to: tenant.contact_email });
  }

  if (tenant.contact_email && iosBuild) {
    const email = renderIosReadyEmail(tenant.app_name, iosBuild.storeUrl || iosBuild.artifactUrl);
    await sendTransactionalEmail(env, { html: email.html, subject: email.subject, to: tenant.contact_email });
  }
}
