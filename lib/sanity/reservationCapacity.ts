import { randomUUID } from "node:crypto";

import { getWriteClient } from "@/lib/sanity/writeClient";
import type { Pack } from "@/lib/data/packs";
import type { ReservationContact } from "@/lib/email";

/**
 * Ledger real de capacidad, en paralelo al mock de lib/data/slots.ts que sigue alimentando toda
 * la UI visible (panel flotante, CTA, bolitas) sin cambios — este ledger es nuevo y, por ahora,
 * nadie lo lee de vuelta en el sitio. Se usa `.inc()` (atómico server-side de verdad, inmune a
 * lost-updates) tal y como se pidió explícitamente, pero eso por sí solo NO impide que dos
 * peticiones concurrentes lean la misma quincena con "hueco justo" y ambas incrementen,
 * pasándose de capacidadTotal entre las dos — por eso cada inc() se verifica en el mismo round
 * trip (commit({returnDocuments:true})) y, si se pasó, se compensa con dec() y se reintenta
 * contra la siguiente candidata.
 *
 * Fuera de alcance, a propósito: no hay cancelación aquí. El campo `estado: "cancelada"` del
 * schema reserva existe para una tarea futura que revierta capacidadConsumida — ese código no
 * existe todavía, esto NO lo cubre.
 */

const MAX_ATTEMPTS = 3;
const CANDIDATE_LIMIT = 10;

export class SinCapacidadError extends Error {
  constructor() {
    super("No hay quincenas con capacidad suficiente.");
    this.name = "SinCapacidadError";
  }
}

interface QuincenaCandidate {
  _id: string;
  capacidadTotal: number;
  capacidadConsumida: number;
}

function costFor(pack: Pick<Pack, "slotCost">): number {
  return pack.slotCost === "full" ? 1 : 0.5;
}

/**
 * Reclama capacidad de forma segura en UNA quincena y devuelve su _id. Máximo 3 intentos REALES
 * (llamadas .inc() de verdad) — una candidata descartada de antemano por su propio snapshot, sin
 * llegar a escribir nada, no cuenta como intento.
 *
 * Límite conocido y aceptado: si las primeras candidatas chocan por carrera contra otras
 * peticiones justo cuando había una más adelante en la lista con hueco real, esto puede devolver
 * SinCapacidadError de forma falsa. Irrelevante al volumen de este negocio — no se sube el límite
 * para no complicar el retry sin necesidad real.
 */
async function claimQuincena(cost: number): Promise<string> {
  const client = getWriteClient();
  const today = new Date().toISOString().slice(0, 10);

  const candidates = await client.fetch<QuincenaCandidate[]>(
    `*[_type == "slotQuincena" && fechaFin >= $today] | order(fechaInicio asc) [0...$limit] {
       _id, capacidadTotal, capacidadConsumida
     }`,
    { today, limit: CANDIDATE_LIMIT }
  );

  let attempts = 0;

  for (const quincena of candidates) {
    const freeAtSnapshot = quincena.capacidadTotal - quincena.capacidadConsumida;
    if (freeAtSnapshot < cost) continue; // no consume intento: descartada sin escribir nada
    if (attempts >= MAX_ATTEMPTS) break;
    attempts++;

    let updated: QuincenaCandidate;
    try {
      updated = await client
        .patch(quincena._id)
        .inc({ capacidadConsumida: cost })
        .commit<QuincenaCandidate>({ returnDocuments: true });
    } catch (err) {
      // El commit ha fallado del todo (red, permisos...) — no se ha aplicado nada, no hay que
      // compensar. Se pasa a la siguiente candidata.
      console.error(`claimQuincena: fallo en commit sobre ${quincena._id}`, err);
      continue;
    }

    if (updated.capacidadConsumida <= updated.capacidadTotal) {
      return quincena._id; // reclamado con éxito, dentro de límite
    }

    // Sobrepasado por una carrera contra otra petición concurrente: deshacer y pasar a la
    // siguiente candidata (no reintentar la misma — ya sabemos que está llena).
    try {
      await client.patch(quincena._id).dec({ capacidadConsumida: cost }).commit();
    } catch (err) {
      console.error(
        `claimQuincena: fallo compensando ${quincena._id} tras sobrepasar capacidad`,
        err
      );
    }
  }

  throw new SinCapacidadError();
}

export interface ReservarCapacidadResult {
  quincenaId: string;
  reservaId: string;
}

/**
 * Punto de entrada llamado desde app/reserva/actions.ts, solo después de que los dos emails
 * (interno + confirmación) hayan tenido éxito. Reclama la quincena (fase 1) y, en una sola
 * transacción (fase 2), crea el documento `reserva` y añade su referencia a
 * slotQuincena.reservas — o pasan las dos cosas juntas, o ninguna: nunca un reserva huérfano sin
 * backlink.
 */
export async function reservarCapacidad(
  pack: Pack,
  contact: ReservationContact
): Promise<ReservarCapacidadResult> {
  const client = getWriteClient();
  const cost = costFor(pack);
  const quincenaId = await claimQuincena(cost);
  const reservaId = `reserva.${randomUUID()}`;

  await client
    .transaction()
    .create({
      _id: reservaId,
      _type: "reserva",
      pack: pack.slug,
      quincena: { _type: "reference", _ref: quincenaId },
      estado: "confirmada",
      nombre: contact.nombre,
      email: contact.email,
      telefono: contact.telefono,
      direccion: contact.direccion,
      pisoPuerta: contact.pisoPuerta || undefined,
      ciudad: contact.ciudad,
      codigoPostal: contact.codigoPostal,
      provincia: contact.provincia,
    })
    .patch(quincenaId, (p) =>
      p
        .setIfMissing({ reservas: [] })
        .insert("after", "reservas[-1]", [
          { _type: "reference", _ref: reservaId, _key: randomUUID() },
        ])
    )
    .commit();

  return { quincenaId, reservaId };
}
