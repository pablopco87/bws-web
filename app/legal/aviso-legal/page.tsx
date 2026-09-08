import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { LiveDot } from "@/components/site/live-dot";

export const metadata: Metadata = {
  title: "Aviso legal · Brutal Work Studio",
  description:
    "Datos identificativos del titular de Brutal Work Studio conforme al artículo 10 de la LSSI-CE.",
};

/**
 * content/legal-borrador-bws.md §1 — texto cerrado, tal cual. Sin cambios de redacción aquí,
 * solo maquetación.
 */
export default function AvisoLegalPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "AVISO LEGAL" }]} />

      <Container className="pt-16 pb-20 lg:pt-[120px] lg:pb-[120px]">
        <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
          <LiveDot />
          LEGAL
        </div>
        <h1 className="mt-6 max-w-[680px] text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[56px] lg:leading-[1.08]">
          Aviso legal
        </h1>

        <div className="mt-10 max-w-[680px] lg:mt-14">
          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
            Información y Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:
          </p>

          <ul className="mt-6 list-disc space-y-2 pl-5 text-lg leading-[1.6] text-muted marker:text-accent lg:text-xl lg:leading-[1.72]">
            <li>
              <strong className="font-medium text-foreground">Titular</strong>: Pablo Pérez
              Comesaña
            </li>
            <li>
              <strong className="font-medium text-foreground">NIF</strong>: 53186834R
            </li>
            <li>
              <strong className="font-medium text-foreground">Domicilio</strong>: Raposa 31, 1 -
              36208 - Vigo - Pontevedra
            </li>
            <li>
              <strong className="font-medium text-foreground">Correo de contacto</strong>:{" "}
              <a
                href="mailto:contacto@brutalworkstudio.com"
                className="text-accent underline-offset-4 hover:underline"
              >
                contacto@brutalworkstudio.com
              </a>
            </li>
            <li>
              <strong className="font-medium text-foreground">Actividad</strong>: venta de
              escenografía modular para Warhammer 40.000 (producto físico impreso en 3D y
              archivos digitales STL)
            </li>
            <li>
              <strong className="font-medium text-foreground">Dominio</strong>:
              brutalworkstudio.com
            </li>
          </ul>

          <p className="mt-8 text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            El acceso y uso de este sitio web atribuye la condición de usuario y supone la
            aceptación plena de las condiciones incluidas en este Aviso Legal, en la{" "}
            <Link
              href="/legal/privacidad"
              className="text-accent underline-offset-4 hover:underline"
            >
              Política de Privacidad
            </Link>{" "}
            y en los{" "}
            <Link
              href="/legal/terminos-y-condiciones"
              className="text-accent underline-offset-4 hover:underline"
            >
              Términos y Condiciones de Venta
            </Link>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
