export interface AppErrorOptions {
  code: string;
  details?: unknown;
  message: string;
  statusCode: number;
}

/**
 * Erreur applicative standardisée pour les handlers Fastify.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly statusCode: number;

  /**
   * Construit une erreur HTTP métier.
   *
   * @param options - Paramètres métier de l'erreur
   */
  public constructor(options: AppErrorOptions) {
    super(options.message);
    this.code = options.code;
    this.details = options.details;
    this.statusCode = options.statusCode;
  }
}

/**
 * Garantit qu'une condition métier est vraie.
 *
 * @param condition - Condition attendue
 * @param error - Erreur à lever en cas d'échec
 */
export function invariant(condition: unknown, error: AppError): asserts condition {
  if (!condition) {
    throw error;
  }
}
