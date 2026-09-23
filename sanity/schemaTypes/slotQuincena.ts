import { defineField, defineType } from "sanity";

/**
 * Ledger real de capacidad de fabricación — una quincena = un slot (15 días). Reemplaza, para
 * efectos de contabilidad real (no para lo que se muestra en el sitio, que sigue leyendo
 * lib/data/slots.ts sin cambios), el mock estático de tandas. capacidadConsumida solo debe
 * cambiar vía lib/sanity/reservationCapacity.ts (.inc()/.dec()) — readOnly aquí para que no se
 * desincronice con una edición manual en Studio.
 */
export const slotQuincena = defineType({
  name: "slotQuincena",
  title: "Quincena de fabricación",
  type: "document",
  fields: [
    defineField({
      name: "fechaInicio",
      title: "Fecha de inicio",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fechaFin",
      title: "Fecha de fin",
      type: "date",
      validation: (Rule) =>
        Rule.required()
          .min(Rule.valueOfField("fechaInicio"))
          .error("La fecha de fin debe ser posterior a la de inicio."),
    }),
    defineField({
      name: "capacidadTotal",
      title: "Capacidad total",
      description: "Siempre 1 — una quincena es un slot completo.",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "capacidadConsumida",
      title: "Capacidad consumida",
      description:
        "No editar a mano — la actualiza solo la app al confirmar una reserva (mutación atómica " +
        "en lib/sanity/reservationCapacity.ts). Un ajuste manual aquí desincroniza el ledger.",
      type: "number",
      initialValue: 0,
      readOnly: true,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "reservas",
      title: "Reservas",
      description: "La rellena la app al confirmar cada reserva — no editar a mano.",
      type: "array",
      initialValue: [],
      of: [{ type: "reference", to: [{ type: "reserva" }] }],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      fechaInicio: "fechaInicio",
      fechaFin: "fechaFin",
      total: "capacidadTotal",
      consumida: "capacidadConsumida",
    },
    prepare({ fechaInicio, fechaFin, total, consumida }) {
      return {
        title: `${fechaInicio ?? "?"} → ${fechaFin ?? "?"}`,
        subtitle: `${consumida ?? 0} / ${total ?? 0} ocupado`,
      };
    },
  },
});
