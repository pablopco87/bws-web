import type { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { LiveDot } from "@/components/site/live-dot";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { Button } from "@/components/ui/button";
import { SliderSystemCoding } from "@/components/site/slider-system-coding";
import { SliderSystemHero } from "@/components/site/slider-system-hero-loader";

export const metadata: Metadata = {
  title: "Slider System™ · Brutal Work Studio",
  description:
    "Unión en cola de milano que monta y desmonta a mano, sin pegamento ni bisagras, y mantiene los 90º durante toda la partida.",
};

/**
 * Página de autoridad técnica del Slider System — design/project/Slider System BWS.dc.html
 * (artboard 6a; 6b-6e son direcciones alternativas descartadas). El hero usa la geometría real de
 * FD2pA/FD2pB (ver components/site/slider-system-hero.tsx); el resto es contenido estático fiel
 * al mockup, con datos sin cerrar dejados como placeholder explícito igual que en Packs/STL.
 */
export default function SliderSystemPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "SLIDER SYSTEM" }]} />

      {/* 01 · Hero · mecanismo */}
      <Container className="pt-14 pb-16 lg:pt-[72px] lg:pb-20">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[1fr_600px] lg:items-stretch lg:gap-14">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
              <LiveDot />
              UNIÓN MECÁNICA · COLA DE MILANO · SIN PEGAMENTO
            </div>
            <h1 className="mt-7 text-[52px] leading-[0.96] font-semibold tracking-[-0.03em] lg:text-[78px]">
              Slider
              <br />
              System™
            </h1>
            <p className="mt-6 max-w-[440px] text-lg leading-[1.55] text-muted lg:text-xl">
              Una unión en cola de milano que monta y desmonta a mano, sin pegamento ni bisagras, y
              mantiene los 90º durante toda la partida.
            </p>

            <dl className="mt-10 grid max-w-[440px] grid-cols-2 gap-x-8 gap-y-6 border-t border-border-hairline pt-8">
              <MetaField label="UNIÓN" value="Dovetail bilateral" />
              <MetaField label="ÁNGULO" value="90º estables" />
              <MetaField label="MONTAJE" value="Sin herramientas" />
              <MetaField label="TOLERANCIA" value="0,15 mm" mono accent />
            </dl>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button variant="solid" asChild>
                <Link href="/packs/tournament">Ver el pack Tournament</Link>
              </Button>
              <Button variant="secondary" asChild>
                <a href="#">Descargar ficha técnica</a>
              </Button>
            </div>
          </div>

          <SliderSystemHero />
        </div>
      </Container>

      {/* 02 · Cómo funciona */}
      <div className="border-t border-border-divider bg-surface-alt py-16 lg:py-20">
        <Container>
          <SectionHeading eyebrow="02 — MECÁNICA DE LA UNIÓN" title="Cómo funciona" />
          <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[1fr_440px] lg:items-start">
            <div>
              <PhotoPlaceholder
                aspect="16/9"
                label=""
                caption="MONTAJE COMPLETO DE UNA RUINA · SUELO + PAREDES · PLANO CENITAL Y DETALLE DE UNIÓN · 16:9 · SIN AUDIO · BUCLE"
              />
              <div className="flex items-center justify-center border border-t-0 border-border-hairline px-6 py-4">
                <Play className="size-6 text-accent" strokeWidth={1.4} />
                <span className="ml-3 font-mono text-[11px] tracking-[0.16em] text-accent">
                  VÍDEO · PENDIENTE DE RODAJE
                </span>
              </div>
              <div className="flex items-center justify-between gap-5 border border-t-0 border-border-hairline px-[22px] py-4 font-mono text-[10.5px] tracking-[0.12em] text-muted-3">
                <span>DEMOSTRACIÓN DE MONTAJE</span>
                <span className="text-accent">SUELO → MUROS → ESQUINAS</span>
              </div>
            </div>
            <div className="flex flex-col">
              <MechanicPoint
                number="01 — COLA DE MILANO"
                title="El perfil se cierra sobre sí mismo"
                description="El macho entra deslizando en vertical y queda bloqueado en el plano horizontal. No hay tornillo, imán ni cola: la geometría del perfil es lo que sujeta el ángulo."
              />
              <MechanicPoint
                number="02 — HEMBRA BILATERAL"
                title="Cada muro acepta unión por los dos lados"
                description="Las esquinas no están atadas a una posición del layout. No hay pieza «correcta» que buscar entre el set: cualquier muro encaja con cualquier otro por cualquiera de sus dos extremos."
              />
              <MechanicPoint
                number="03 — MONTAJE Y DESMONTAJE"
                title="Sin pegamento y sin herramientas"
                description="Se monta con las manos y se desmonta igual, sin marcar la pieza. El mismo muro puede cambiar de sitio entre partida y partida sin perder ajuste."
                last
              />
            </div>
          </div>
        </Container>
      </div>

      {/* 03 · Problemas que resuelve */}
      <Container className="py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="03 — PROBLEMAS QUE RESUELVE" title="Frente a las tres alternativas" noMargin />
          <span className="border border-accent/34 px-3 py-2 font-mono text-[11px] tracking-[0.1em] text-accent">
            CIFRAS PENDIENTES DE CERRAR
          </span>
        </div>
        <div className="mt-10 grid gap-6 border-t border-dashed border-border-hairline pt-10 lg:mt-12 lg:grid-cols-3">
          <VersusCard
            n="01"
            against="BISAGRA"
            title="No pierde firmeza ni gana holgura con el uso"
            description="La bisagra trabaja sobre un eje, y el eje se holga cada vez que se abre y se cierra. Al cabo de unas partidas el muro deja de caer a 90º y cae donde el desgaste le deja. La cola de milano no tiene pieza móvil: el ajuste es geométrico y se repone entero en cada montaje."
          />
          <VersusCard
            n="02"
            against="ESCENOGRAFÍA MDF"
            title="Menos piezas, montaje más rápido y no se rompe"
            description="El MDF llega en plancha troquelada: separar, encolar, esperar el secado y confiar en que no se astille al transportarlo. Aquí la pieza sale impresa entera y no necesita cola. Una mesa completa son [XX] piezas frente a las [XXX] de un kit MDF equivalente."
          />
          <VersusCard
            n="03"
            against="ESCENOGRAFÍA NO DESMONTABLE"
            title="Ocupa poco al guardar y viaja plana"
            description="Una ruina montada en bloque ocupa su volumen entero para siempre: en el armario, en el maletero y en la mesa del club. Desmontada en piezas planas, la misma mesa baja a [XX] litros y entra en una caja de transporte estándar."
          />
        </div>
      </Container>

      {/* 04 · Codificación alfanumérica */}
      <div className="border-t border-border-divider bg-surface-alt py-16 lg:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="04 — IDENTIFICACIÓN DE PIEZA" title="Codificación en la base" noMargin />
            <p className="max-w-[400px] text-right text-sm leading-[1.6] text-muted">
              Solo en las ruinas en L. Nomenclatura oficial de layouts de Games Workshop.
            </p>
          </div>
          <SliderSystemCoding />
        </Container>
      </div>

      {/* 05 · Ficha técnica */}
      <Container className="border-y border-border-divider py-10">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-7">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={1.2}
              className="shrink-0"
            >
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5M12 12v5M9.5 14.5L12 17l2.5-2.5" />
            </svg>
            <div>
              <div className="text-xl font-medium tracking-[-0.015em]">
                Ficha técnica del Slider System
              </div>
              <p className="mt-2 max-w-lg text-sm leading-[1.6] text-muted">
                Cotas de la unión, tolerancias, material y condiciones de impresión. El mismo
                documento que acompaña a los packs y a los STL.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 gap-y-3 sm:gap-6">
            <span className="font-mono text-[11px] tracking-[0.12em] text-muted-3 whitespace-nowrap">
              PDF · [XX] PÁG · [X,X MB]
            </span>
            <Button variant="primary" asChild className="whitespace-nowrap">
              <a href="#">Descargar ficha técnica</a>
            </Button>
          </div>
        </div>
      </Container>

      {/* 06 · CTA a producto */}
      <Container className="py-[104px] text-center lg:pt-[104px] lg:pb-[112px]">
        <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
          06 — SIGUIENTE PASO
        </div>
        <h2 className="mx-auto mt-6 max-w-3xl text-[36px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[52px]">
          El sistema se entiende montándolo
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-[1.6] text-muted">
          Tournament es la mesa completa con la unión Slider System en todas sus piezas. El resto
          de packs la comparten.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button variant="solid" asChild>
            <Link href="/packs/tournament">Ver el pack Tournament</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/packs">Ver los 5 packs</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}

function MetaField({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.12em] text-muted-3">{label}</div>
      <div
        className={`mt-1.5 text-lg font-medium ${mono ? "font-mono" : ""} ${accent ? "text-accent" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  noMargin,
}: {
  eyebrow: string;
  title: string;
  noMargin?: boolean;
}) {
  return (
    <div className={noMargin ? "" : "mb-10 lg:mb-12"}>
      <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">{eyebrow}</div>
      <h2 className="mt-5 text-[28px] leading-[1.14] font-semibold tracking-[-0.02em] lg:text-[36px]">
        {title}
      </h2>
    </div>
  );
}

function MechanicPoint({
  number,
  title,
  description,
  last,
}: {
  number: string;
  title: string;
  description: string;
  last?: boolean;
}) {
  return (
    <div className={`py-6 first:pt-0 ${last ? "" : "border-b border-border-hairline"}`}>
      <div className="font-mono text-[11px] tracking-[0.14em] text-accent">{number}</div>
      <div className="mt-3 text-xl font-medium tracking-[-0.015em]">{title}</div>
      <p className="mt-2.5 text-[15px] leading-[1.6] text-muted">{description}</p>
    </div>
  );
}

function VersusCard({
  n,
  against,
  title,
  description,
}: {
  n: string;
  against: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col border border-border-hairline p-7">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[13px] tracking-[0.14em] text-muted-3">{n}</span>
        <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-3">FRENTE A</span>
      </div>
      <div className="mt-3.5 font-mono text-[13px] tracking-[0.12em] text-accent">{against}</div>
      <div className="mt-3.5 text-[26px] leading-[1.15] font-medium tracking-[-0.02em]">{title}</div>
      <p className="mt-4 text-[15px] leading-[1.62] text-muted">{description}</p>
    </div>
  );
}
