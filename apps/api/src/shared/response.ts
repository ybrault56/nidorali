import type { ApiFailure, ApiSuccess, PaginatedMeta } from "@nidorali/types";

/**
 * Retourne une réponse de succès standardisée.
 *
 * @param data - Payload principal
 * @param meta - Métadonnées de pagination éventuelles
 * @returns Enveloppe HTTP standardisée
 */
export function success<TData>(data: TData, meta?: PaginatedMeta): ApiSuccess<TData> {
  return {
    data,
    meta,
    success: true,
  };
}

/**
 * Retourne une réponse d'erreur standardisée.
 *
 * @param code - Code métier stable
 * @param message - Message lisible
 * @param details - Détails optionnels
 * @returns Enveloppe d'erreur standardisée
 */
export function failure(code: string, message: string, details?: unknown): ApiFailure {
  return {
    error: {
      code,
      details,
      message,
    },
    success: false,
  };
}
