import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { SanityClient } from "@sanity/client";

import { packs } from "@/lib/data/packs";
import type { Pack } from "@/lib/data/packs";
import { sendResto, sendSenal } from "@/lib/email";
import {
  compensate,
  costFor,
  deadlineInMadrid,
  todayInMadrid,
} from "@/lib/sanity/reservationCapacity";
import { getWriteClient } from "@/lib/sanity/writeClient";

/**
 * Único cron del proyecto. Recorre cuatro lotes de `reserva` una vez al día (ver vercel.json) y
 * hace avanzar el estado de cada una — ver sanity/schemaTypes/reserva.ts para el grafo completo.
 * Node runtime obligatorio: reservationCapacity.ts importa node:crypto a nivel de módulo, algo
 * que Edge no soporta de forma fiable con @sanity/client.
 */
export const runtime = "nodejs";
// Next 15+ ya no cachea GET por defecto, pero se deja explícito — mismo estilo defensivo que el
// resto del repo, y evita cualquier sorpresa si esa default cambia otra vez.
export const dynamic = "force-dynamic";
// Tope deliberadamente por debajo del máximo de Hobby (300s) — este batch es de pocos documentos
// al día; si algo se cuelga, mejor fallar en 60s con log claro que agotar los 5 minutos.
export const maxDuration = 60;

interface ReservaDoc {
  _id: string;
  _rev: string;
  pack: string;
  nombre: string;
  email: string;
  estado: string;
  restoAPagar?: number;
  quincena: { _id: string };
}

/** Proyección de processExpirados — no necesita nombre/email, a diferencia de ReservaDoc. */
interface ReservaExpirada {
  _id: string;
  _rev: string;
  pack: string;
  estado: string;
  quincena: { _id: string };
}

/** Proyección de processLiberacionesPendientes — no necesita `estado` (el filtro ya lo fija). */
interface ReservaCancelada {
  _id: string;
  _rev: string;
  pack: string;
  quincena: { _id: string };
}

const REVERT_ATTEMPTS = 2;

function packOf(slug: string): Pack | undefined {
  return packs.find((p) => p.slug === slug);
}

/**
 * Revierte un avance de estado cuando el email correspondiente ha fallado, con un reintento antes
 * de rendirse (mismo patrón que compensate() en reservationCapacity.ts). Si los dos intentos
 * fallan, el documento queda con un plazo de 5 días corriendo sobre un email que el cliente nunca
 * recibió, y processExpirados lo cancelaría igualmente cuando venza — riesgo real pero acotado
 * (requiere que fallen el envío Y las dos reversiones seguidas), documentado aquí en vez de
 * construir un mecanismo de confirmación de entrega aparte para un caso de esta probabilidad.
 */
async function revertirEstado(
  client: SanityClient,
  docId: string,
  estadoAnterior: string,
  campoFecha: "senalFechaLimite" | "restoFechaLimite"
): Promise<void> {
  for (let attempt = 1; attempt <= REVERT_ATTEMPTS; attempt++) {
    try {
      await client.patch(docId).unset([campoFecha]).set({ estado: estadoAnterior }).commit();
      return;
    } catch (err) {
      console.error(
        `revertirEstado: intento ${attempt}/${REVERT_ATTEMPTS} fallido para ${docId} (→ ${estadoAnterior})`,
        err
      );
    }
  }
  console.error(
    `revertirEstado: ${docId} queda SIN revertir tras ${REVERT_ATTEMPTS} intentos — el cliente no ` +
      `recibió el email pero el plazo de 5 días sigue corriendo; requiere corrección manual en ` +
      `Studio antes de que processExpirados lo cancele sin que nadie haya sido avisado.`
  );
}

/**
 * Lote A — reservada → señal-solicitada. El patch de estado va SIEMPRE antes del envío del
 * email, con ifRevisionId como cerrojo optimista: si otra invocación concurrente (Vercel admite
 * que un mismo tick puede dispararse dos veces) ya tocó este documento, este patch falla limpio
 * y el documento se omite — sin email duplicado. Si el patch tiene éxito pero el email falla, se
 * revierte el estado para que el tick de mañana lo reintente (mismo espíritu que compensate() en
 * reservationCapacity.ts: nunca un email de más, en el peor caso uno de menos que se cura solo).
 */
async function processSenalDue(client: SanityClient, today: string): Promise<void> {
  const docs = await client.fetch<ReservaDoc[]>(
    `*[_type == "reserva" && estado == "reservada" && quincena->fechaInicio <= $today]{
       _id, _rev, pack, nombre, email, estado, "quincena": quincena->{_id}
     }`,
    { today }
  );

  for (const doc of docs) {
    const pack = packOf(doc.pack);
    if (!pack) {
      console.error(`cron/reservas: pack desconocido "${doc.pack}" en reserva ${doc._id} — omitida`);
      continue;
    }

    const senalFechaLimite = deadlineInMadrid(5);
    try {
      await client
        .patch(doc._id)
        .ifRevisionId(doc._rev)
        .set({ estado: "senal-solicitada", senalFechaLimite })
        .commit();
    } catch (err) {
      console.error(`cron/reservas: fallo marcando señal-solicitada en ${doc._id}`, err);
      continue;
    }

    try {
      await sendSenal(pack, { nombre: doc.nombre, email: doc.email });
    } catch (err) {
      console.error(`cron/reservas: fallo enviando email de señal para ${doc._id} — revirtiendo estado`, err);
      await revertirEstado(client, doc._id, "reservada", "senalFechaLimite");
    }
  }
}

/**
 * Lote B — fabricada → resto-solicitado. Sin filtro de fecha (no hay presión de tiempo en este
 * lado, según el brief). Se omite (no se revierte nada, no hay nada que revertir) cualquier
 * documento sin restoAPagar válido — es la red de seguridad ante el caso real de que Pablo marque
 * "Fabricada" antes de rellenar el importe.
 */
async function processFabricadas(client: SanityClient): Promise<void> {
  const docs = await client.fetch<ReservaDoc[]>(
    `*[_type == "reserva" && estado == "fabricada"]{
       _id, _rev, pack, nombre, email, estado, restoAPagar, "quincena": quincena->{_id}
     }`
  );

  for (const doc of docs) {
    const pack = packOf(doc.pack);
    if (!pack) {
      console.error(`cron/reservas: pack desconocido "${doc.pack}" en reserva ${doc._id} — omitida`);
      continue;
    }
    if (typeof doc.restoAPagar !== "number" || doc.restoAPagar < 0) {
      console.error(
        `cron/reservas: reserva ${doc._id} marcada "fabricada" sin restoAPagar válido — omitida, ` +
          `rellénalo en Studio para que se envíe en el próximo tick`
      );
      continue;
    }

    const restoFechaLimite = deadlineInMadrid(5);
    try {
      await client
        .patch(doc._id)
        .ifRevisionId(doc._rev)
        .set({ estado: "resto-solicitado", restoFechaLimite })
        .commit();
    } catch (err) {
      console.error(`cron/reservas: fallo marcando resto-solicitado en ${doc._id}`, err);
      continue;
    }

    try {
      await sendResto(pack, { nombre: doc.nombre, email: doc.email }, doc.restoAPagar);
    } catch (err) {
      console.error(`cron/reservas: fallo enviando email del resto para ${doc._id} — revirtiendo estado`, err);
      await revertirEstado(client, doc._id, "fabricada", "restoFechaLimite");
    }
  }
}

/**
 * Lote C — impago de señal o de resto → cancelación + liberación de capacidad. El PATCH de
 * estado va siempre antes del dec() de capacidad, nunca al revés: si se liberara la capacidad
 * primero y luego fallara el patch de estado, el documento seguiría cumpliendo el filtro mañana y
 * se liberaría la misma capacidad dos veces (un bug real de sobre-liberación, distinto del riesgo
 * ya aceptado de "capacidad fantasma" que documenta compensate()).
 */
async function processExpirados(client: SanityClient, today: string): Promise<void> {
  const docs = await client.fetch<ReservaExpirada[]>(
    `*[_type == "reserva" && (
        (estado == "senal-solicitada" && senalFechaLimite < $today) ||
        (estado == "resto-solicitado" && restoFechaLimite < $today)
      )]{ _id, _rev, pack, estado, "quincena": quincena->{_id} }`,
    { today }
  );

  for (const doc of docs) {
    const pack = packOf(doc.pack);
    if (!pack) {
      console.error(`cron/reservas: pack desconocido "${doc.pack}" en reserva ${doc._id} — omitida`);
      continue;
    }
    const nuevoEstado =
      doc.estado === "senal-solicitada" ? "cancelada-impago-senal" : "cancelada-impago-resto";

    try {
      await client
        .patch(doc._id)
        .ifRevisionId(doc._rev)
        // capacidadLiberada va en el MISMO set() que estado, nunca en un segundo commit separado:
        // si se partiera en dos escrituras, se abriría una ventana entre ambas en la que una
        // invocación concurrente de processLiberacionesPendientes podría reclamar y liberar esta
        // misma reserva en paralelo al compensate() de aquí abajo — doble liberación. Con la
        // escritura atómica conjunta, en el instante en que el documento se vuelve visible para el
        // filtro de ese lote, capacidadLiberada ya es true — nunca hay ventana.
        .set({ estado: nuevoEstado, capacidadLiberada: true })
        .commit();
    } catch (err) {
      console.error(`cron/reservas: fallo cancelando ${doc._id}`, err);
      continue;
    }

    await compensate(client, doc.quincena._id, costFor(pack), `cron: ${nuevoEstado} en ${doc._id}`);
  }
}

/**
 * Lote D — catch-all de liberación de capacidad. No le importa CÓMO ni POR QUÉ una reserva llegó
 * a un estado cancelado — impago vía processExpirados, o "Cancelada — manual" puesta a mano en
 * Studio por cualquier motivo (petición del cliente, error al reservar) — solo si
 * `capacidadLiberada` sigue sin estar a `true`. Reclama el documento PRIMERO (patch de
 * capacidadLiberada con ifRevisionId como cerrojo optimista, idéntico al patrón que ya usan los
 * otros tres lotes) y solo si ese patch tiene éxito llama a compensate() — así dos invocaciones
 * concurrentes del cron nunca liberan la misma reserva dos veces.
 *
 * `!= true` (no `== false`) es deliberado: en GROQ un campo sin definir es `null`, y `null != true`
 * también es `true` — así se cogen tanto los documentos con el flag a false como los que nunca lo
 * tuvieron.
 *
 * Depende de que processExpirados ponga `capacidadLiberada: true` en el MISMO commit que cambia
 * `estado` (ver el comentario allí) — si algún día se separan, este lote puede doble-liberar.
 */
async function processLiberacionesPendientes(client: SanityClient): Promise<void> {
  const docs = await client.fetch<ReservaCancelada[]>(
    `*[_type == "reserva" &&
       estado in ["cancelada-impago-senal", "cancelada-impago-resto", "cancelada-manual"] &&
       capacidadLiberada != true
      ]{ _id, _rev, pack, "quincena": quincena->{_id} }`
  );

  for (const doc of docs) {
    const pack = packOf(doc.pack);
    if (!pack) {
      console.error(`cron/reservas: pack desconocido "${doc.pack}" en reserva ${doc._id} — omitida`);
      continue;
    }

    try {
      await client.patch(doc._id).ifRevisionId(doc._rev).set({ capacidadLiberada: true }).commit();
    } catch (err) {
      console.error(`cron/reservas: fallo reclamando liberación de ${doc._id}`, err);
      continue;
    }

    await compensate(
      client,
      doc.quincena._id,
      costFor(pack),
      `cron: liberación catch-all (cancelación manual o preexistente) en ${doc._id}`
    );
  }
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let client: SanityClient;
  try {
    client = getWriteClient();
  } catch (err) {
    console.error("cron/reservas: fallo obteniendo el write client", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const today = todayInMadrid();

  // Secuencial, con aislamiento por bloque: si un bloque entero falla (Sanity caído a mitad), los
  // otros dos se intentan igual. Dentro de cada bloque, cada documento ya se aísla por su cuenta.
  for (const [label, task] of [
    ["senal-due", () => processSenalDue(client, today)],
    ["fabricadas", () => processFabricadas(client)],
    ["expirados", () => processExpirados(client, today)],
    ["liberaciones-pendientes", () => processLiberacionesPendientes(client)],
  ] as const) {
    try {
      await task();
    } catch (err) {
      console.error(`cron/reservas: bloque "${label}" falló por completo`, err);
    }
  }

  return NextResponse.json({ ok: true, today });
}
