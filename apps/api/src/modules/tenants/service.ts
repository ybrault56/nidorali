import type { FastifyInstance } from "fastify";
import type { BuildJobStatus } from "@nidorali/types";

import { AppError } from "../../shared/errors.js";

/**
 * Liste tous les tenants pour le back-office Nidorali.
 */
export function listAdminTenants(fastify: FastifyInstance) {
  return fastify.dataRepository.listTenants();
}

/**
 * Retourne le détail d'un tenant et ses builds associés.
 */
export async function getAdminTenant(fastify: FastifyInstance, tenantId: string) {
  const tenant = await fastify.dataRepository.getTenantById(tenantId);
  if (!tenant) {
    throw new AppError({
      code: "tenant_not_found",
      message: "Tenant introuvable.",
      statusCode: 404,
    });
  }

  const buildJobs = await fastify.dataRepository.listBuildJobs(tenant.id);
  return {
    ...tenant,
    buildJobs,
  };
}

/**
 * Retourne l'historique des builds.
 */
export function listAdminBuilds(fastify: FastifyInstance) {
  return fastify.dataRepository.listBuildJobs();
}

/**
 * Déclenche un build via le build-service interne.
 */
export async function triggerTenantBuild(
  fastify: FastifyInstance,
  tenantId: string,
  platform: "android" | "ios" | "both",
) {
  const tenant = await fastify.dataRepository.getTenantById(tenantId);
  if (!tenant) {
    throw new AppError({
      code: "tenant_not_found",
      message: "Tenant introuvable.",
      statusCode: 404,
    });
  }

  const buildJob = await fastify.dataRepository.createBuildJob({
    platform,
    tenant_id: tenant.id,
  });

  const response = await fetch(`${fastify.env.BUILD_SERVICE_URL}/internal/builds`, {
    body: JSON.stringify({
      build_job_id: buildJob.id,
      platform,
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
      code: "build_trigger_failed",
      details: await response.text(),
      message: "Le build-service a refusé la demande.",
      statusCode: 502,
    });
  }

  return buildJob;
}

/**
 * Génère une URL d'upload signée pour un logo tenant.
 */
export async function createLogoUploadUrl(fastify: FastifyInstance, tenantId?: string) {
  const objectPath = `logos/${tenantId ?? "draft"}/${crypto.randomUUID()}.png`;
  const signedUpload = await fastify.supabase.storage.from("tenant-assets").createSignedUploadUrl(objectPath);
  if (signedUpload.error || !signedUpload.data) {
    throw new AppError({
      code: "logo_upload_url_failed",
      details: signedUpload.error?.message,
      message: "Impossible de créer l'URL d'upload.",
      statusCode: 500,
    });
  }

  const publicUrl = fastify.supabase.storage.from("tenant-assets").getPublicUrl(objectPath);
  return {
    path: objectPath,
    publicUrl: publicUrl.data.publicUrl,
    signedUrl: signedUpload.data.signedUrl,
    token: signedUpload.data.token,
  };
}

/**
 * Applique une mise à jour de build provenant du build-service simulé.
 */
export async function updateSimulationBuildJob(
  fastify: FastifyInstance,
  buildJobId: string,
  payload: {
    android_artifact_url?: string | null;
    app_store_url?: string | null;
    completed_at?: string | null;
    eas_build_id_android?: string | null;
    eas_build_id_ios?: string | null;
    error_message?: string | null;
    ios_artifact_url?: string | null;
    play_store_url?: string | null;
    started_at?: string | null;
    status: BuildJobStatus;
    tenant_id: string;
  },
) {
  const buildJob = await fastify.dataRepository.getBuildJob(buildJobId);
  if (!buildJob || buildJob.tenant_id !== payload.tenant_id) {
    throw new AppError({
      code: "build_job_not_found",
      message: "Build introuvable.",
      statusCode: 404,
    });
  }

  const { tenant_id: tenantId, ...buildPatch } = payload;
  const updatedBuildJob = await fastify.dataRepository.updateBuildJob(buildJobId, buildPatch);

  const tenantStatusByBuildStatus: Record<BuildJobStatus, "building" | "live" | "pending"> = {
    building: "building",
    done: "live",
    failed: "pending",
    processing: "building",
    queued: "pending",
    submitting: "building",
  };

  await fastify.dataRepository.updateTenantStatus(tenantId, tenantStatusByBuildStatus[payload.status]);

  return updatedBuildJob;
}
