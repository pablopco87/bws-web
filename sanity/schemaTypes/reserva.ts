import { defineField, defineType } from "sanity";

import { packs } from "@/lib/data/packs";

/**
 * Una reserva confirmada, persistida como documento real (antes solo vivía en los emails de
 * app/reserva/actions.ts). `pack` es un string (el slug), no una referencia — no existe un
 * document type "pack" en Sanity todavía, el catálogo sigue siendo el array estático de
 * lib/data/packs.ts; el desplegable de abajo se genera de ahí, así que si el catálogo cambia esto
 * se actualiza solo. `estado` deja sitio para una futura cancelación, pero ningún código dispara
 * ese cambio todavía — no está construida esa parte.
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
      description: "Sin flujo de cancelación construido todavía — hoy siempre \"confirmada\".",
      type: "string",
      options: { list: ["confirmada", "cancelada"] },
      initialValue: "confirmada",
      validation: (Rule) => Rule.required(),
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
