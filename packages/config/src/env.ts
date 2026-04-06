import fs from "node:fs";
import path from "node:path";

import type { z } from "zod";

/**
 * Parse un fichier `.env` simple en paires clé/valeur.
 *
 * @param filePath - Chemin absolu du fichier à lire
 * @returns Variables extraites du fichier
 */
function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/u)
    .reduce<Record<string, string>>((accumulator, line) => {
      const trimmed = line.trim();
      if (trimmed.length === 0 || trimmed.startsWith("#")) {
        return accumulator;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^['"]|['"]$/gu, "");

      if (key.length > 0) {
        accumulator[key] = value;
      }

      return accumulator;
    }, {});
}

/**
 * Charge les fichiers d'environnement locaux du répertoire courant.
 *
 * @returns Variables issues de `.env` puis `.env.local`
 */
function loadEnvFilesFromCwd(): Record<string, string> {
  const cwd = process.cwd();

  return {
    ...parseEnvFile(path.join(cwd, ".env")),
    ...parseEnvFile(path.join(cwd, ".env.local")),
  };
}

/**
 * Valide un objet d'environnement avec Zod.
 *
 * @param schema - Schéma de validation de l'environnement
 * @param source - Source à valider, `process.env` par défaut
 * @returns L'environnement validé et typé
 */
export function createValidatedEnv<TShape extends z.ZodRawShape>(
  schema: z.ZodObject<TShape>,
  source: Record<string, string | undefined> = process.env,
): z.infer<typeof schema> {
  return schema.parse({
    ...loadEnvFilesFromCwd(),
    ...source,
  });
}
