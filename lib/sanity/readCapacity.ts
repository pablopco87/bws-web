import { createClient, type SanityClient } from "next-sanity";

import { costFor, tieneHuecoPara, todayInMadrid } from "@/lib/sanity/reservationCapacity";
import type { Pack } from "@/lib/data/packs";

/**
 * Cliente de lectura — separado a propósito de getWriteClient() (lib/sanity/writeClient.ts):
 * token distinto (SANITY_API_READ_TOKEN, rol Viewer en Sanity — un bug o copy-paste en este
 * código, que a partir de ahora se llama desde varias páginas, no puede escribir nada en el
 * ledger ni con ese token), `useCdn: true`, e integrado con el fetch-cache de Next vía
 * `next: {revalidate}` en cada `.fetch()`. Nunca importar esto desde un Client Component — el
 * dataset es privado (contiene PII en `reserva`), así que SANITY_API_READ_TOKEN tiene que
 * quedarse server-only igual que SANITY_API_TOKEN, aunque sea "de solo lectura".
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

export interface QuincenaCapacidad {
  _id: string;
  fechaInicio: string; // "YYYY-MM-DD", sin hora/zona
  fechaFin: string;
  capacidadTotal: number;
  capacidadConsumida: number;
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

export type QuincenaAvailabilityStatus = "libre" | "espera" | "cerrado";

/**
 * Misma forma discriminada que PackAvailability en lib/data/slots.ts (no reutilizado — ReservaForm
 * depende de ese tipo tal cual, fuera de alcance de esta migración): "libre" si la primera
 * quincena de la ventana ya alcanza, "espera" si es una posterior, "cerrado" si ninguna.
 */
export type QuincenaAvailability =
  | { status: "libre" | "espera"; quincena: QuincenaCapacidad }
  | { status: "cerrado"; quincena: null };

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

const MONTH_ABBR = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

/**
 * fechaInicio/fechaFin son fechas de calendario puras (sin hora) — a diferencia de "hoy" en
 * todayInMadrid(), no hay instante/zona que desambiguar aquí, así que parsear como UTC y leer con
 * getUTC*() es correcto sin pasar por el huso de Madrid.
 */
function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${d.getUTCDate()} ${MONTH_ABBR[d.getUTCMonth()]}`;
}

/** Formato de rango neutro — decisión de diseño propia, sin copy cerrada en ningún brief. */
export function formatQuincenaRange(q: Pick<QuincenaCapacidad, "fechaInicio" | "fechaFin">): string {
  return `${formatDate(q.fechaInicio)} – ${formatDate(q.fechaFin)}`;
}

/** 0, 1 o 2 — unidades de media-quincena libres (capacidadTotal siempre 1, en pasos de 0,5). */
export function freeUnits(q: Pick<QuincenaCapacidad, "capacidadTotal" | "capacidadConsumida">): 0 | 1 | 2 {
  return Math.round((q.capacidadTotal - q.capacidadConsumida) * 2) as 0 | 1 | 2;
}

/** Decisión de diseño propia, sin copy cerrada en ningún brief. */
export function formatQuincenaFree(units: 0 | 1 | 2): string {
  if (units === 2) return "LIBRE";
  if (units === 1) return "MEDIO LIBRE";
  return "COMPLETO";
}
