import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { FaqAccordion } from "@/components/site/faq-accordion";

export const metadata: Metadata = {
  title: "FAQ · Brutal Work Studio",
  description:
    "Material, plazos, reserva de turno y licencia de los STL. Preguntas frecuentes de Brutal Work Studio.",
};

/**
 * design/project/FAQ BWS.dc.html (turno 15) — lista plana de 13 preguntas, sin categorías ni
 * filtros. No lleva el panel flotante de slots: no está en el artboard ni en el brief original.
 */
export default function FaqPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "FAQ" }]} />

      <Container className="pt-16 lg:pt-[120px]">
        <Container size="content">
          <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
            FAQ · 13 PREGUNTAS
          </div>
          <h1 className="mt-6 max-w-[900px] text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[68px] lg:leading-[1.06] lg:tracking-[-0.04em]">
            Preguntas frecuentes
          </h1>
          <p className="mt-6 max-w-[680px] text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            Material, plazos, reserva de turno y licencia de los STL. Si falta algo, escríbenos y
            lo respondemos por email.
          </p>
        </Container>

        <Container size="content" className="mt-14 lg:mt-[72px]">
          <FaqAccordion />
        </Container>

        <Container size="content" className="pb-20 lg:pb-[120px]">
          <Link
            href="/contacto"
            className="group mt-14 inline-flex items-center gap-[7px] border-b border-accent/32 text-base text-accent transition-colors duration-200 hover:border-link-hover hover:text-link-hover lg:mt-[72px]"
          >
            Escríbenos si falta tu pregunta
            <span className="font-mono transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Container>
      </Container>
    </>
  );
}
