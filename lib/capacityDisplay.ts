/**
 * Tipos y formateo puro de disponibilidad de quincenas — sin cliente de Sanity, sin credenciales,
 * sin I/O. Deliberadamente separado de lib/sanity/readCapacity.ts (que sí importa
 * reservationCapacity.ts, marcado "server-only") para que components/site/floating-slots-panel.tsx
 * (Client Component) pueda importar los formateadores/tipos sin arrastrar esa cadena server-only a
 * su bundle de cliente — eso rompía el build (confirmado con un build real) antes de esta
 * separación.
 */

export interface QuincenaCapacidad {
  _id: string;
  fechaInicio: string; // "YYYY-MM-DD", sin hora/zona
  fechaFin: string;
  capacidadTotal: number;
  capacidadConsumida: number;
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

const MONTH_ABBR = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

/**
 * fechaInicio/fechaFin son fechas de calendario puras (sin hora) — a diferencia de "hoy" en
 * todayInMadrid() (lib/sanity/reservationCapacity.ts), no hay instante/zona que desambiguar aquí,
 * así que parsear como UTC y leer con getUTC*() es correcto sin pasar por el huso de Madrid.
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
