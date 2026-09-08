import type { Metadata } from "next";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { LiveDot } from "@/components/site/live-dot";

export const metadata: Metadata = {
  title: "Política de privacidad · Brutal Work Studio",
  description:
    "Cómo se tratan los datos personales en Brutal Work Studio: finalidades, legitimación, destinatarios y derechos.",
};

/**
 * content/legal-borrador-bws.md §2 — texto cerrado, tal cual. Sin cambios de redacción aquí,
 * solo maquetación.
 */
export default function PrivacidadPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "PRIVACIDAD" }]} />

      <Container className="pt-16 pb-20 lg:pt-[120px] lg:pb-[120px]">
        <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
          <LiveDot />
          LEGAL
        </div>
        <h1 className="mt-6 max-w-[680px] text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[56px] lg:leading-[1.08]">
          Política de privacidad
        </h1>

        <div className="mt-10 max-w-[680px] space-y-8 lg:mt-14">
          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Responsable del tratamiento</strong>:
            Pablo Pérez Comesaña,{" "}
            <a
              href="mailto:contacto@brutalworkstudio.com"
              className="text-accent underline-offset-4 hover:underline"
            >
              contacto@brutalworkstudio.com
            </a>
            .
          </p>

          <div>
            <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
              <strong className="font-medium text-foreground">Finalidades del tratamiento</strong>:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-lg leading-[1.6] text-muted marker:text-accent lg:text-xl lg:leading-[1.72]">
              <li>
                Gestionar pedidos, reservas y comunicaciones asociadas al proceso de compra
                (fabricación, envío, pago de señal y resto).
              </li>
              <li>Atender consultas enviadas por email o formulario de contacto.</li>
              <li>
                Enviar comunicaciones transaccionales (confirmaciones de reserva, avisos de turno
                de pago, actualizaciones de fabricación).
              </li>
            </ul>
          </div>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Legitimación</strong>: ejecución de
            una relación contractual o precontractual (reserva/compra) y consentimiento explícito
            para comunicaciones que no sean estrictamente necesarias para el pedido.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Destinatarios</strong>: los datos
            pueden compartirse con proveedores tecnológicos estrictamente necesarios para prestar
            el servicio — Resend (envío de emails transaccionales), Sanity (gestión de contenido
            y estado de disponibilidad), y en el futuro Stripe (procesamiento de pagos) cuando se
            active el cobro automatizado. Ninguno de estos proveedores usa los datos con fines
            propios ajenos a la prestación del servicio.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Conservación</strong>: los datos se
            conservan mientras dure la relación con el usuario y, posteriormente, durante los
            plazos legalmente exigibles (obligaciones fiscales y contables).
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Derechos</strong>: acceso,
            rectificación, supresión, oposición, limitación del tratamiento y portabilidad,
            ejercitables escribiendo a{" "}
            <a
              href="mailto:contacto@brutalworkstudio.com"
              className="text-accent underline-offset-4 hover:underline"
            >
              contacto@brutalworkstudio.com
            </a>
            . También puede presentarse reclamación ante la Agencia Española de Protección de
            Datos (AEPD) si se considera que el tratamiento no se ajusta a la normativa.
          </p>
        </div>
      </Container>
    </>
  );
}
