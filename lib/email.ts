import { Resend } from "resend";

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

  return getResend().emails.send({
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
  return getResend().emails.send({
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
