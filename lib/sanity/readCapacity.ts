import "server-only";

import { createClient, type SanityClient } from "next-sanity";

import { costFor, tieneHuecoPara, todayInMadrid } from "@/lib/sanity/reservationCapacity";
import {
  type QuincenaAvailability,
  type QuincenaCapacidad,
} from "@/lib/capacityDisplay";
import type { Pack } from "@/lib/data/packs";

/**
 * Cliente de lectura — separado a propósito de getWriteClient() (lib/sanity/writeClient.ts):
 * token distinto (SANITY_API_READ_TOKEN, rol Viewer en Sanity — un bug o copy-paste en este
 * código, que a partir de ahora se llama desde varias páginas, no puede escribir nada en el
 * ledger ni con ese token), `useCdn: true`, e integrado con el fetch-cache de Next vía
 * `next: {revalidate}` en cada `.fetch()`. Este módulo entero es server-only (ver import de
 * arriba) — los tipos/formateo puros que sí necesita el panel flotante (Client Component) viven
 * en lib/capacityDisplay.ts, deliberadamente aparte, para que ese componente nunca tenga que
 * arrastrar esta cadena (ni su token) a su bundle de cliente.
 */
let client: SanityClient | null = null;

export function getReadClient(): SanityClient {
  if (client) return client;

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!projectId || !dataset) {
    throw new Error("Sanity: faltan NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET");
  }
  if (!token) {
    throw new Error("Sanity: falta SANITY_API_READ_TOKEN");
  }

  client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-09-23",
    token,
    useCdn: true,
  });
  return client;
}

/**
 * Cuántas quincenas futuras trae la consulta — deliberadamente menor que el CANDIDATE_LIMIT=10 de
 * claimQuincena en reservationCapacity.ts: ese margen existe para sobrevivir sus MAX_ATTEMPTS=3
 * reintentos reales bajo contención concurrente, una dinámica que no existe en una simple lectura
 * de display. 8 (~4 meses) es de sobra para el volumen de este negocio.
 */
const FETCH_LOOKAHEAD = 8;
const REVALIDATE_SECONDS = 60;

const QUINCENAS_QUERY = `*[_type == "slotQuincena" && fechaFin >= $today] | order(fechaInicio asc) [0...$limit] {
  _id, fechaInicio, fechaFin, capacidadTotal, capacidadConsumida
}`;

/**
 * Lectura pública de las próximas quincenas, cacheada por Next (ISR, revalidate 60s) — el
 * verdadero guardián contra el overbooking sigue siendo claimQuincena, que lee siempre fresco en
 * el momento real de la reserva; esto es solo lo que se muestra mientras tanto. Si falla (Sanity
 * caído, token mal puesto), se deja propagar — no se captura aquí para degradar en silencio a
 * "cerrado", que sería engañoso.
 */
export async function getUpcomingQuincenas(): Promise<QuincenaCapacidad[]> {
  const client = getReadClient();
  return client.fetch<QuincenaCapacidad[]>(
    QUINCENAS_QUERY,
    { today: todayInMadrid(), limit: FETCH_LOOKAHEAD },
    { next: { revalidate: REVALIDATE_SECONDS } }
  );
}

/**
 * Pura, sin I/O. Usa tieneHuecoPara (reservationCapacity.ts) — la misma regla de selección que
 * claimQuincena, no una copia — para que ambos lados no puedan desincronizarse en silencio.
 */
export function getQuincenaAvailability(
  quincenas: QuincenaCapacidad[],
  pack: Pick<Pack, "slotCost">
): QuincenaAvailability {
  const cost = costFor(pack);
  const index = quincenas.findIndex((q) => tieneHuecoPara(q, cost));
  if (index === -1) return { status: "cerrado", quincena: null };
  return { status: index === 0 ? "libre" : "espera", quincena: quincenas[index] };
}
