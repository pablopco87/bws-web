import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";

import type { Pack } from "@/lib/data/packs";
import type { PackAvailability } from "@/lib/data/slots";

/**
 * Only place the Resend SDK is imported. Reservation flow only — no other feature sends email
 * yet. `RESEND_API_KEY` is read once at module load; if it's missing, `getResend()` throws with a
 * clear message instead of Resend's own opaque failure the first time `.emails.send()` runs.
 */
let client: Resend | null = null;
function getResend(): Resend {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no está configurada");
  client = new Resend(apiKey);
  return client;
}

const FROM = "Brutal Work Studio <reservas@brutalworkstudio.com>";
const INTERNAL_TO = "contacto@brutalworkstudio.com";

/**
 * `resend.emails.send()` does NOT throw for application-level failures (unverified recipient
 * under sandbox restrictions, unverified domain, invalid address...) — it resolves successfully
 * with `{ data: null, error: {...} }`. Both functions below used to await the call directly and
 * ignore `.error`, so a failed send looked exactly like success from actions.ts's point of view:
 * this is why the "reserva confirmada" UI could show up for a customer whose confirmation email
 * Resend actually rejected — the failure never became a thrown error for the existing try/catch
 * in app/reserva/actions.ts to catch. Every send goes through this now so a real failure always
 * surfaces there instead of being swallowed here.
 */
async function sendOrThrow(payload: CreateEmailOptions) {
  const result = await getResend().emails.send(payload);
  if (result.error) {
    throw new Error(`Resend: ${result.error.name} — ${result.error.message}`);
  }
  console.log(`Resend: enviado a ${String(payload.to)} (id ${result.data?.id})`);
  return result.data;
}

export interface ReservationContact {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  pisoPuerta: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
}

function availabilityLabel(availability: PackAvailability): string {
  if (availability.status === "libre") {
    return `Libre · tanda ${String(availability.tanda.number).padStart(2, "0")}`;
  }
  if (availability.status === "espera") {
    return `En cola · entraría en tanda ${String(availability.tanda.number).padStart(2, "0")}`;
  }
  return "Sin tanda abierta";
}

/**
 * Notifica la reserva a contacto@brutalworkstudio.com para que se anote a mano. Se envía primero:
 * si falla, la reserva no ha "pasado" nada todavía y reintentar es seguro (ver app/reserva/actions.ts).
 */
export async function sendReservationNotice(pack: Pack, availability: PackAvailability, contact: ReservationContact) {
  const direccionCompleta = [
    contact.direccion,
    contact.pisoPuerta,
    `${contact.codigoPostal} ${contact.ciudad}`,
    contact.provincia,
  ]
    .filter(Boolean)
    .join(", ");

  return sendOrThrow({
    from: FROM,
    to: INTERNAL_TO,
    replyTo: contact.email,
    subject: `Nueva reserva · ${pack.name} · ${contact.nombre}`,
    text: [
      `Pack: ${pack.name} (${pack.slug})`,
      `Disponibilidad en el momento de la reserva: ${availabilityLabel(availability)}`,
      "",
      `Nombre: ${contact.nombre}`,
      `Email: ${contact.email}`,
      `Teléfono: ${contact.telefono}`,
      `Dirección: ${direccionCompleta}`,
      "",
      `Recibido: ${new Date().toISOString()}`,
    ].join("\n"),
  });
}

/**
 * Confirmación al cliente — mismo wording neutro que la pantalla de confirmación
 * (components/site/reserva-form.tsx), ya cerrado. Se envía solo después de que el email interno
 * haya salido con éxito.
 */
export async function sendReservationConfirmation(pack: Pack, contact: ReservationContact) {
  return sendOrThrow({
    from: FROM,
    to: contact.email,
    subject: "Reserva confirmada · Brutal Work Studio",
    text: [
      `Hola ${contact.nombre},`,
      "",
      "Reserva confirmada. Te avisaremos por email en cuanto llegue tu turno de fabricación.",
      "",
      `Pack: ${pack.name}`,
      "",
      "— Brutal Work Studio",
    ].join("\n"),
  });
}

export interface TurnoContact {
  nombre: string;
  email: string;
}

const BIZUM_NUMERO = "627 384 492";
const IBAN = "ES98 1583 0001 1190 2079 1270";

/**
 * Importe de la señal en euros — reparte por el mismo slotCost que costFor() en
 * lib/sanity/reservationCapacity.ts (unidades de capacidad), pero mide otra cosa; función propia
 * en vez de reutilizar esa, para no acoplar dos conceptos que solo coinciden hoy por casualidad.
 */
function senalImporte(pack: Pick<Pack, "slotCost">): number {
  return pack.slotCost === "full" ? 20 : 10;
}

/**
 * Email 1 del flujo de cobro manual — pide la señal. Disparado únicamente por
 * app/api/cron/reservas/route.ts (reservada → señal-solicitada), nunca de forma síncrona al
 * reservar. Copy verbatim del brief — solo se interpolan los corchetes, sin tocar el resto
 * (incluida la ausencia deliberada de línea en blanco tras el saludo, a diferencia de
 * sendReservationConfirmation).
 */
export async function sendSenal(pack: Pack, contact: TurnoContact) {
  const importe = senalImporte(pack);
  return sendOrThrow({
    from: FROM,
    to: contact.email,
    subject: `Tu turno de fabricación ya está aquí — ${pack.name} BWS`,
    text: [
      `Hola ${contact.nombre}, Te toca. En cuanto confirmemos la señal, tu pack ${pack.name} entra en fabricación.`,
      `Señal a pagar ahora: ${importe}€`,
      `Bizum: al ${BIZUM_NUMERO} — indica en el concepto tu nombre y "${pack.name}"`,
      `Transferencia: ${IBAN} — mismo concepto`,
      `Tienes 5 días desde este email para pagar la señal; pasado ese plazo, el turno pasa al siguiente en cola. Ya tenemos tu dirección de envío de cuando reservaste, no hace falta que nos escribas de nuevo.`,
      `En cuanto confirmemos el pago, te lo decimos por aquí y arrancamos fabricación (6-7 días).`,
      `Cualquier duda, respondes a este mismo email. — BWS`,
    ].join("\n"),
  });
}

/**
 * Email 2 del flujo de cobro manual — pide el resto. Disparado únicamente por
 * app/api/cron/reservas/route.ts (fabricada → resto-solicitado). `restoAPagar` viene del campo
 * homónimo en Sanity, rellenado a mano por Pablo — no hay precio de catálogo del que calcularlo.
 */
export async function sendResto(pack: Pack, contact: TurnoContact, restoAPagar: number) {
  const importeSenal = senalImporte(pack);
  return sendOrThrow({
    from: FROM,
    to: contact.email,
    subject: `Tu pack ya está fabricado — ${pack.name} BWS`,
    text: [
      `Hola ${contact.nombre}, Buenas noticias: tu pack ${pack.name} ya está fabricado y listo para enviar en cuanto completemos el pago.`,
      `Resto a pagar: ${restoAPagar}€ (precio total menos la señal de ${importeSenal}€ ya pagada; IVA y envío incluidos)`,
      `Bizum: al ${BIZUM_NUMERO} — mismo concepto que la señal`,
      `Transferencia: ${IBAN} — mismo concepto`,
      `Tienes 5 días desde este email para completar el pago. En cuanto lo confirmemos, lo enviamos.`,
      `Cualquier duda, respondes a este mismo email. — BWS`,
    ].join("\n"),
  });
}
