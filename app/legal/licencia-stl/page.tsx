import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { LiveDot } from "@/components/site/live-dot";

export const metadata: Metadata = {
  title: "Licencia de uso de archivos STL · Brutal Work Studio",
  description:
    "Condiciones de la licencia de uso personal, no comercial, de los archivos STL de Brutal Work Studio.",
};

/**
 * content/legal-borrador-bws.md §5 — texto cerrado, tal cual. Sin cambios de redacción aquí,
 * solo maquetación.
 */
export default function LicenciaStlPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "LICENCIA STL" }]} />

      <Container className="pt-16 pb-20 lg:pt-[120px] lg:pb-[120px]">
        <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
          <LiveDot />
          LEGAL
        </div>
        <h1 className="mt-6 max-w-[680px] text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[56px] lg:leading-[1.08]">
          Licencia de uso de archivos STL
        </h1>

        <div className="mt-10 max-w-[680px] lg:mt-14">
          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            La compra de un archivo STL en brutalworkstudio.com concede una licencia de{" "}
            <strong className="font-medium text-foreground">uso personal, no comercial</strong>.
            Queda prohibido:
          </p>

          <ul className="mt-6 list-disc space-y-2 pl-5 text-lg leading-[1.6] text-muted marker:text-accent lg:text-xl lg:leading-[1.72]">
            <li>
              Revender, redistribuir o compartir el archivo STL con terceros, de forma gratuita o
              de pago.
            </li>
            <li>Vender o comercializar piezas impresas a partir de este archivo.</li>
          </ul>

          <p className="mt-8 text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            El comprador es responsable de la configuración de impresión (ver{" "}
            <Link href="/stl" className="text-accent underline-offset-4 hover:underline">
              Guía de configuración de impresión
            </Link>
            ) — Brutal Work Studio no garantiza un resultado concreto si se usan parámetros de
            impresión distintos a los recomendados.
          </p>
        </div>
      </Container>
    </>
  );
}
