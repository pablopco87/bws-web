import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { FloatingSlotsPanel } from "@/components/site/floating-slots-panel";
import { LiveDot } from "@/components/site/live-dot";
import { PackCard } from "@/components/site/pack-card";
import { packs } from "@/lib/data/packs";

export const metadata: Metadata = {
  title: "Packs · Brutal Work Studio",
  description:
    "Cinco packs físicos de escenografía modular con Slider System™. Dos cubren mesa, tres resuelven piezas concretas.",
};

const mesaPacks = packs.filter((p) => p.category === "mesa");
const piezasPacks = packs.filter((p) => p.category === "piezas");

/**
 * design/project/Packs BWS.dc.html (turno 10, artboard 10a — "dos bloques" cerrado; la variante
 * plana 10b se descartó explícitamente en chat4.md). No hay checkout real: "Ver ficha" navega a
 * /packs/[slug], nada de esto cobra ni reserva desde aquí.
 */
export default function PacksPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "PACKS" }]} />

      <Container className="pt-16 lg:pt-[100px]">
        <div className="max-w-[820px]">
          <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
            <LiveDot />
            CATÁLOGO · 5 PACKS FÍSICOS
          </div>
          <h1 className="mt-6 text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[62px] lg:leading-[1.05]">
            Packs
          </h1>
          <p className="mt-6 max-w-[640px] text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            Escenografía impresa en 3D con Slider System™. Dos packs cubren mesa; tres resuelven
            piezas concretas. Cada pack ocupa slot de fabricación en una única impresora, así que
            la disponibilidad va por tandas.
          </p>
        </div>

        {/* 01 · Packs de mesa */}
        <section className="mt-16 lg:mt-20">
          <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
            01 · PACKS DE MESA
          </div>
          <p className="mt-4 max-w-[640px] text-base leading-[1.6] text-muted lg:text-lg">
            Empieza aquí si no tienes escenografía todavía: el pack te deja la mesa jugable sin
            añadir nada más.
          </p>
          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2">
            {mesaPacks.map((pack) => (
              <PackCard key={pack.slug} pack={pack} size="large" />
            ))}
          </div>
        </section>

        {/* 02 · Packs de piezas específicas */}
        <section id="piezas-especificas" className="mt-16 scroll-mt-24 lg:mt-20">
          <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
            02 · PACKS DE PIEZAS ESPECÍFICAS
          </div>
          <p className="mt-4 max-w-[640px] text-base leading-[1.6] text-muted lg:text-lg">
            Para quien ya tiene mesa y necesita una familia de pieza concreta. Se acoplan al mismo
            dovetail que los packs de mesa.
          </p>
          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-3">
            {piezasPacks.map((pack) => (
              <PackCard key={pack.slug} pack={pack} size="small" />
            ))}
          </div>
        </section>

        {/* Línea al pie del catálogo */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border-hairline pt-6 lg:mt-12 lg:flex-row lg:items-center lg:justify-between">
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted-3 uppercase">
            Piezas, precio y tiempo de fabricación pendientes de cierre
          </span>
          <Link
            href="/stl"
            className="group inline-flex items-center gap-[7px] border-b border-accent/32 text-accent transition-colors duration-200 hover:border-link-hover hover:text-link-hover"
          >
            ¿Prefieres imprimirlo tú? Catálogo STL
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>

      {/* 03 · Qué pack necesitas */}
      <div className="mt-16 border-y border-border-divider bg-surface-alt py-14 lg:mt-20 lg:py-16">
        <Container>
          <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
            03 · QUÉ PACK NECESITAS
          </div>
          <p className="mt-4 max-w-[640px] text-base leading-[1.6] text-muted lg:text-lg">
            Tres situaciones, una salida cada una.
          </p>
          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-3">
            <DecisionRoute
              number="01"
              title="Necesito montar una mesa completa"
              description="No tienes escenografía o quieres una mesa de torneo entera con un solo pedido."
              cta="Tournament · 1 slot"
              href="/packs/tournament"
            />
            <DecisionRoute
              number="02"
              title="Me vale media mesa"
              description="Juegas compartiendo mesa con otro jugador o prefieres empezar por la mitad y ampliar después."
              cta="Battle Ready · 1/2 slot"
              href="/packs/battle-ready"
            />
            <DecisionRoute
              number="03"
              title="Ya tengo la base y me faltan piezas"
              description="Buscas una familia concreta: ruinas altas, barricadas y acueducto o muros bajos."
              cta="3 packs de piezas"
              href="#piezas-especificas"
            />
          </div>
        </Container>
      </div>

      <FloatingSlotsPanel />
    </>
  );
}

function DecisionRoute({
  number,
  title,
  description,
  cta,
  href,
}: {
  number: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="border border-border-hairline p-7">
      <span className="font-mono text-xs tracking-[0.14em] text-muted-3">{number}</span>
      <h3 className="mt-4 text-xl font-semibold tracking-[-0.015em]">{title}</h3>
      <p className="mt-3 text-[15px] leading-[1.6] text-muted">{description}</p>
      <Link
        href={href}
        className="group mt-6 inline-flex items-center gap-[7px] font-mono text-[11px] tracking-[0.12em] text-accent"
      >
        {cta.toUpperCase()}
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
