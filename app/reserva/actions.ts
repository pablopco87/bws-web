"use server";

import { packs } from "@/lib/data/packs";
import { getPackAvailability } from "@/lib/data/slots";
import { sendReservationConfirmation, sendReservationNotice } from "@/lib/email";
import type { ReservationContact } from "@/lib/email";

export type ReservaResult =
  | { ok: true }
  | { ok: false; stage: "validation" | "internal" | "confirmation"; message: string };

const REQUIRED_FIELDS: (keyof ReservationContact)[] = [
  "nombre",
  "email",
  "telefono",
  "direccion",
  "ciudad",
  "codigoPostal",
  "provincia",
];

/**
 * Server Action detrás del formulario de reserva. La UI de éxito en reserva-form.tsx solo se
 * muestra a partir de `{ ok: true }` devuelto por esta función — nunca de forma optimista — así
 * que todo lo que pueda salir mal tiene que devolver `ok: false` en vez de lanzar sin más.
 */
export async function reservar(slug: string, formData: FormData): Promise<ReservaResult> {
  const pack = packs.find((p) => p.slug === slug);
  if (!pack) {
    return { ok: false, stage: "validation", message: "Pack no encontrado." };
  }

  // Honeypot: si un bot rellena este campo oculto, se descarta en silencio — el bot ve éxito
  // (para no enseñarle que fue detectado), pero no se envía ningún email real.
  const honeypot = String(formData.get("empresa") ?? "").trim();
  if (honeypot !== "") {
    return { ok: true };
  }

  const contact: ReservationContact = {
    nombre: String(formData.get("nombre") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim(),
    pisoPuerta: String(formData.get("pisoPuerta") ?? "").trim(),
    ciudad: String(formData.get("ciudad") ?? "").trim(),
    codigoPostal: String(formData.get("codigoPostal") ?? "").trim(),
    provincia: String(formData.get("provincia") ?? "").trim(),
  };

  for (const field of REQUIRED_FIELDS) {
    if (!contact[field]) {
      return { ok: false, stage: "validation", message: "Faltan datos obligatorios en el formulario." };
    }
  }
  if (!/^\S+@\S+\.\S+$/.test(contact.email)) {
    return { ok: false, stage: "validation", message: "El email no parece válido." };
  }

  const availability = getPackAvailability(pack);

  // El email interno va primero: si falla, nada se ha "confirmado" todavía y reintentar es
  // seguro — no hay riesgo de que contacto@ pierda la reserva ni de duplicar nada.
  try {
    await sendReservationNotice(pack, availability, contact);
  } catch (err) {
    console.error("reservar: fallo enviando email interno", err);
    return {
      ok: false,
      stage: "internal",
      message: "No hemos podido registrar tu reserva. Vuelve a intentarlo en un momento.",
    };
  }

  // El interno ya salió, así que la reserva YA está en manos de Pablo. Si el email de
  // confirmación al cliente falla aquí, no se invita a reintentar (duplicaría el interno) — se
  // avisa con un mensaje distinto: la reserva es real aunque el email no haya llegado.
  try {
    await sendReservationConfirmation(pack, contact);
  } catch (err) {
    console.error("reservar: fallo enviando confirmación al cliente", err);
    return {
      ok: false,
      stage: "confirmation",
      message:
        "Hemos recibido tu reserva, pero no hemos podido enviarte el email de confirmación. Te contactaremos igualmente — no hace falta que vuelvas a enviar el formulario.",
    };
  }

  return { ok: true };
}
