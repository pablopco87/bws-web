import { defineField, defineType } from "sanity";

import { packs } from "@/lib/data/packs";

/**
 * Una reserva confirmada, persistida como documento real (antes solo vivía en los emails de
 * app/reserva/actions.ts). `pack` es un string (el slug), no una referencia — no existe un
 * document type "pack" en Sanity todavía, el catálogo sigue siendo el array estático de
 * lib/data/packs.ts; el desplegable de abajo se genera de ahí, así que si el catálogo cambia esto
 * se actualiza solo.
 *
 * `estado` es la máquina de estados completa del flujo de cobro manual (app/api/cron/reservas/
 * route.ts): reservada →(cron) señal-solicitada →(Pablo, a mano) en-fabricacion →(Pablo) fabricada
 * →(cron) resto-solicitado →(Pablo) pagada →(Pablo) enviada, con dos salidas de cancelación por
 * impago que dispara el cron. Las transiciones manuales son solo tracking — el cron nunca las lee.
 */
export const reserva = defineType({
  name: "reserva",
  title: "Reserva",
  type: "document",
  fields: [
    defineField({
      name: "pack",
      title: "Pack",
      type: "string",
      options: { list: packs.map((p) => ({ title: p.name, value: p.slug })) },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quincena",
      title: "Quincena",
      type: "reference",
      to: [{ type: "slotQuincena" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "estado",
      title: "Estado",
      description:
        "Automáticos (cron diario): reservada→señal-solicitada, fabricada→resto-solicitado, y " +
        "las dos cancelaciones por impago. Manuales en Studio: señal-solicitada→en-fabricacion " +
        "(al confirmar el Bizum/transferencia de la señal), en-fabricacion→fabricada (rellena " +
        "también Resto a pagar en ese momento), resto-solicitado→pagada, pagada→enviada.",
      type: "string",
      options: {
        list: [
          { title: "Reservada", value: "reservada" },
          { title: "Señal solicitada", value: "senal-solicitada" },
          { title: "En fabricación", value: "en-fabricacion" },
          { title: "Fabricada", value: "fabricada" },
          { title: "Resto solicitado", value: "resto-solicitado" },
          { title: "Pagada", value: "pagada" },
          { title: "Enviada", value: "enviada" },
          { title: "Cancelada — señal no pagada a tiempo", value: "cancelada-impago-senal" },
          { title: "Cancelada — resto no pagado a tiempo", value: "cancelada-impago-resto" },
        ],
      },
      initialValue: "reservada",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "senalFechaLimite",
      title: "Señal — fecha límite de pago",
      description:
        "La fija el cron al enviar el email de señal (fecha de envío + 5 días). Editable a mano " +
        "solo para conceder una prórroga puntual — no la toques salvo para eso.",
      type: "date",
    }),
    defineField({
      name: "restoFechaLimite",
      title: "Resto — fecha límite de pago",
      description:
        "La fija el cron al enviar el email del resto (fecha de envío + 5 días). Editable a mano " +
        "solo para conceder una prórroga puntual — no la toques salvo para eso.",
      type: "date",
    }),
    defineField({
      name: "restoAPagar",
      title: "Resto a pagar (€)",
      description:
        'Rellénalo a mano ANTES de marcar el estado como "Fabricada" — el cron lo necesita para ' +
        "componer el email del resto y no lo enviará sin este dato.",
      type: "number",
      validation: (Rule) =>
        Rule.min(0)
          .integer()
          .custom((value, context) => {
            const doc = context.document as { estado?: string } | undefined;
            const posterior = [
              "fabricada",
              "resto-solicitado",
              "pagada",
              "enviada",
              "cancelada-impago-resto",
            ];
            if (posterior.includes(doc?.estado ?? "") && (value === undefined || value === null)) {
              return "Falta indicar el resto a pagar — obligatorio antes de marcar como Fabricada.";
            }
            return true;
          }),
    }),
    defineField({ name: "nombre", title: "Nombre", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "telefono",
      title: "Teléfono",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "direccion",
      title: "Dirección",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "pisoPuerta", title: "Piso / puerta", type: "string" }),
    defineField({ name: "ciudad", title: "Ciudad", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "codigoPostal",
      title: "Código postal",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "provincia",
      title: "Provincia",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { nombre: "nombre", pack: "pack", estado: "estado" },
    prepare({ nombre, pack, estado }) {
      return { title: nombre, subtitle: `${pack} · ${estado}` };
    },
  },
});
