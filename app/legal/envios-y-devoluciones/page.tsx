import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { LiveDot } from "@/components/site/live-dot";

export const metadata: Metadata = {
  title: "Envíos y devoluciones · Brutal Work Studio",
  description:
    "Zona de envío, plazos de fabricación y política de devoluciones de Brutal Work Studio.",
};

/**
 * Reutiliza contenido ya cerrado en content/legal-borrador-bws.md §3 (Envío, Plazos de
 * fabricación) y en app/legal/terminos-y-condiciones/page.tsx (Desistimiento) — no se redacta
 * nada nuevo. La tarifa de envío no está cerrada ni en el código ni en el propio brief de diseño
 * (design/chats/chat5.md:334 la marca explícitamente como "[5-6€ — cifra pendiente de cerrar, usa
 * placeholder, no la fijes]"), así que queda como placeholder explícito en vez de una cifra
 * inventada — confirmado con Pablo antes de escribir esta página.
 */
export default function EnviosYDevolucionesPage() {
  return (
    <>
      <Breadcrumb
        items={[{ label: "INICIO", href: "/" }, { label: "ENVÍOS Y DEVOLUCIONES" }]}
      />

      <Container className="pt-16 pb-20 lg:pt-[120px] lg:pb-[120px]">
        <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
          <LiveDot />
          LEGAL
        </div>
        <h1 className="mt-6 max-w-[680px] text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[56px] lg:leading-[1.08]">
          Envíos y devoluciones
        </h1>

        <div className="mt-10 max-w-[680px] space-y-8 lg:mt-14">
          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Envío</strong>: solo a Península —
            quedan excluidos Baleares, Canarias, Ceuta y Melilla. Tarifa plana de{" "}
            <span className="font-mono text-accent">[TARIFA PENDIENTE DE CERRAR]</span>, indicada
            en el resumen del pedido.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Plazos de fabricación</strong>: 6-7
            días laborables desde la confirmación del pago de la señal, más el tiempo de envío.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Devoluciones</strong>: el derecho de
            desistimiento y sus condiciones se rigen por la cláusula correspondiente de los{" "}
            <Link
              href="/legal/terminos-y-condiciones"
              className="text-accent underline-offset-4 hover:underline"
            >
              Términos y condiciones de venta
            </Link>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
