import { createApp } from "./app.js";

/**
 * Démarre le serveur HTTP de l'API.
 */
async function startServer() {
  const app = await createApp();
  await app.listen({
    host: "0.0.0.0",
    port: app.env.PORT,
  });
}

void startServer();
