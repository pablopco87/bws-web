"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LiveDot } from "@/components/site/live-dot";
import { reservar, type ReservaResult } from "@/app/reserva/actions";
import type { Pack } from "@/lib/data/packs";
import type { PackAvailability } from "@/lib/data/slots";

/**
 * Copy de apoyo por disponibilidad — design/project/Checkout Reserva Senal.dc.html (Turno 14,
 * artboard 14a). El mock solo cierra "inmediato" (libre) y "en cola" (espera); "cerrado" no tiene
 * variante cerrada ahí — sigue el mismo tono que AvailabilityCTA ya usa para ese estado
 * ("Avisarme cuando abra"). Campos y CTA son idénticos en los tres casos, solo cambia este texto.
 */
const COPY: Record<
  PackAvailability["status"],
  { eyebrow: string; title: string; lead: string; hint: string }
> = {
  libre: {
    eyebrow: "RESERVA · SLOT INMEDIATO",
    title: "Hay slot libre: reserva tu pack ahora.",
    lead: "El pack está disponible ya. Déjanos contacto y dirección de envío y te escribimos por email en breve con las instrucciones de pago.",
    hint: "SIN PAGO EN ESTE PASO · INSTRUCCIONES POR EMAIL EN BREVE",
  },
  espera: {
    eyebrow: "RESERVA · EN COLA",
    title: "La tanda está completa: reserva tu turno.",
    lead: "Ahora mismo no hay slot libre. Déjanos contacto y dirección de envío y te avisamos por email cuando llegue tu turno.",
    hint: "SIN PAGO EN ESTE PASO · TE AVISAMOS AL LLEGAR TU TURNO",
  },
  cerrado: {
    eyebrow: "RESERVA · SIN TANDA ABIERTA",
    title: "Sin tandas abiertas ahora mismo: te avisamos.",
    lead: "Ahora mismo no hay tanda abierta para este pack. Déjanos contacto y dirección de envío y te escribimos por email en cuanto abra una.",
    hint: "SIN PAGO EN ESTE PASO · TE AVISAMOS AL ABRIR TANDA",
  },
};

const initialState: ReservaResult | null = null;

export function ReservaForm({ pack, availability }: { pack: Pack; availability: PackAvailability }) {
  const copy = COPY[availability.status];
  const [state, formAction, isPending] = useActionState(
    async (_prev: ReservaResult | null, formData: FormData) => reservar(pack.slug, formData),
    initialState
  );

  if (state?.ok) {
    return <ReservaConfirmada pack={pack} />;
  }

  return (
    <div className="max-w-[880px]">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
            {copy.eyebrow}
          </div>
          <h1 className="mt-6 max-w-2xl text-[32px] leading-[1.14] font-semibold tracking-[-0.03em] lg:text-[44px]">
            {copy.title}
          </h1>
        </div>
        <span className="border border-accent/34 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.12em] text-accent whitespace-nowrap">
          SIN PAGO EN LA WEB
        </span>
      </div>
      <p className="mt-6 max-w-xl text-lg leading-[1.6] text-muted">{copy.lead}</p>

      <form action={formAction} className="mt-12 border border-border-hairline p-8 lg:p-9">
        {/* Honeypot — oculto para personas, un bot que rellena todos los campos del DOM cae aquí. */}
        <div className="absolute -top-[9999px] -left-[9999px]" aria-hidden="true">
          <label>
            Empresa
            <input type="text" name="empresa" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="font-mono text-[10.5px] tracking-[0.14em] text-accent">
          DATOS DE CONTACTO
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="EMAIL" name="email" type="email" placeholder="tu@email.com" required />
          <Field label="TELÉFONO" name="telefono" type="tel" placeholder="600 000 000" required />
          <Field
            label="NOMBRE Y APELLIDOS"
            name="nombre"
            placeholder="Nombre y apellidos"
            required
            className="sm:col-span-2"
          />
        </div>

        <div className="mt-8 border-t border-border-hairline pt-7 font-mono text-[10.5px] tracking-[0.14em] text-accent">
          DIRECCIÓN DE ENVÍO
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field
            label="DIRECCIÓN"
            name="direccion"
            placeholder="Calle y número"
            required
            className="sm:col-span-2"
          />
          <Field label="PISO / PUERTA" name="pisoPuerta" placeholder="Opcional" />
          <Field label="CIUDAD" name="ciudad" placeholder="Ciudad" required />
          <Field label="CÓDIGO POSTAL" name="codigoPostal" placeholder="00000" required />
          <Field
            label="PROVINCIA"
            name="provincia"
            placeholder="Provincia"
            required
            className="sm:col-span-1"
          />
        </div>

        <Notice label="SOLO PENÍNSULA">
          No se envía a Baleares, Canarias, Ceuta ni Melilla. Si tu dirección está fuera de la
          Península, escríbenos antes de reservar y buscamos alternativa.
        </Notice>

        <Notice label="SEÑAL NO REEMBOLSABLE">
          La señal, cuando llegue tu turno de fabricación, no es reembolsable una vez pagada y
          comenzada la fabricación —{" "}
          <Link
            href="/legal/terminos-y-condiciones"
            className="text-accent underline-offset-4 hover:underline"
          >
            ver condiciones completas
          </Link>
          .
        </Notice>

        {state && !state.ok && (
          <div className="mt-7 border border-red-500/40 bg-red-500/[0.06] px-5 py-4 text-[15px] leading-[1.6] text-foreground">
            {state.message}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Button type="submit" variant="solid" disabled={isPending}>
            {isPending ? "Enviando…" : "Reservar"}
          </Button>
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted-3">
            {copy.hint}
          </span>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-3">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="h-[52px] border border-border bg-background px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-3 focus:border-accent"
      />
    </label>
  );
}

function Notice({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-7 flex flex-col gap-2.5 border border-border sm:flex-row sm:gap-4 sm:px-5 sm:py-4.5">
      <span className="shrink-0 px-5 pt-5 font-mono text-[10.5px] tracking-[0.14em] text-accent sm:p-0">
        {label}
      </span>
      <p className="px-5 pb-5 text-sm leading-[1.6] text-muted sm:p-0">{children}</p>
    </div>
  );
}

function ReservaConfirmada({ pack }: { pack: Pack }) {
  return (
    <div className="max-w-[880px] border border-border-hairline p-10 lg:p-16">
      <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-accent">
        <LiveDot />
        RESERVA CONFIRMADA
      </div>
      <h1 className="mt-6 max-w-2xl text-[36px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[52px]">
        Reserva confirmada.
      </h1>
      <p className="mt-6 max-w-lg text-lg leading-[1.6] text-muted lg:text-xl">
        Te avisaremos por email en cuanto llegue tu turno de fabricación.
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-[0.1em] text-muted-3 uppercase">
        {pack.name}
      </p>
      <div className="mt-9">
        <Button variant="secondary" asChild>
          <Link href="/packs">Volver al catálogo</Link>
        </Button>
      </div>
    </div>
  );
}
