import { createClient, type SanityClient } from "@sanity/client";

/**
 * Único cliente de Sanity de esta tarea — no hay lectura pública en alcance (la UI visible sigue
 * leyendo lib/data/slots.ts, sin cambios). Deliberadamente @sanity/client directo, no el wrapper
 * de next-sanity: ese añade integración con el fetch-cache de Next, justo lo contrario de lo que
 * hace falta aquí — la consulta que decide qué quincena tiene hueco necesita el dato más fresco
 * posible antes del incremento atómico, no una copia cacheada. `useCdn: false` evita también la
 * caché de CDN de Sanity (hasta ~60s de retraso). Nunca importar esto desde un Client Component —
 * SANITY_API_TOKEN tiene que quedarse server-only.
 */
let client: SanityClient | null = null;

export function getWriteClient(): SanityClient {
  if (client) return client;

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !dataset) {
    throw new Error("Sanity: faltan NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET");
  }
  if (!token) {
    throw new Error("Sanity: falta SANITY_API_TOKEN");
  }

  client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-09-23",
    token,
    useCdn: false,
  });
  return client;
}
