import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { LiveDot } from "@/components/site/live-dot";
import { StlRow } from "@/components/site/stl-row";
import { Button } from "@/components/ui/button";
import { packs } from "@/lib/data/packs";

export const metadata: Metadata = {
  title: "Archivos STL · Brutal Work Studio",
  description:
    "Catálogo de archivos digitales para imprimir tú mismo. Compra directa, descarga inmediata, licencia de uso personal.",
};

/**
 * Battle Ready no está en este catálogo — decisión cerrada en design/chats/chat3.md:969 ("Sí,
 * Battle Ready no aplica en página de STLs") y chat4.md:22, y reflejada en las filas reales del
 * mockup final (design/project/STL BWS.dc.html, turno 8): solo 4 de las 5 filas de la mega-menú
 * física aparecen aquí. El hero de ese mismo artboard todavía dice "5 packs"/"cinco packs" — copy
 * sin actualizar tras la decisión, mismo tipo de inconsistencia que Footer/mega-menú (CLAUDE.md);
 * se corrige a 4 en este puerto.
 */
const stlPacks = packs.filter((p) => p.slug !== "battle-ready");

/**
 * design/project/STL BWS.dc.html (turno 8, único artboard — la mención en chat4.md:293 de mover
 * este documento a una carpeta "Historial" es una reorganización dentro de la herramienta de
 * diseño, no un archivo superseded en este bundle). Sin módulo de slots (chat2.md:664: "no
 * mostrarlo, el STL no depende de slots"), sin checkbox de licencia (se pide una sola vez en
 * checkout, chat3.md:969), sin el sidebar de desglose de piezas por pack que cierra el mockup —
 * omitido a petición explícita para mantener menor profundidad de contenido que Packs; cada fila
 * ya muestra sus 4 campos básicos. Sin ruta de detalle por variante: STL nunca tuvo una plantilla
 * de ficha individual cerrada, a diferencia de Packs.
 */
export default function StlPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "ARCHIVOS STL" }]} />

      {/* Hero */}
      <Container className="pt-14 pb-16 lg:pt-[72px] lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] text-muted-3">
              <LiveDot />
              ARCHIVOS DIGITALES · IMPRIME TÚ MISMO
            </div>
            <h1 className="mt-6 text-[44px] leading-[1.02] font-semibold tracking-[-0.03em] lg:text-[64px] lg:leading-[0.98]">
              Catálogo STL
            </h1>
            <p className="mt-6 max-w-[560px] text-lg leading-[1.55] text-muted lg:text-xl">
              Los packs del catálogo físico, en archivo. Compra directa, descarga inmediata y
              licencia de uso personal. Sin lista de espera y sin depender de la fabricación.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden border border-border-hairline bg-border-hairline">
            <KpiField label="VARIANTES" value="4 packs" />
            <KpiField label="FORMATO" value=".STL" />
            <KpiField label="ENTREGA" value="Inmediata" accent />
            <KpiField label="LICENCIA" value="Personal" />
          </div>
        </div>
      </Container>

      {/* 01 · Catálogo digital */}
      <div className="border-t border-border-divider bg-surface-alt py-16 lg:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
                01 — CATÁLOGO DIGITAL
              </div>
              <h2 className="mt-5 text-[28px] leading-[1.14] font-semibold tracking-[-0.02em] lg:text-[36px]">
                Variantes
              </h2>
            </div>
            <span className="border border-accent/34 px-3 py-2 font-mono text-[11px] tracking-[0.1em] text-accent">
              RENDERS Y PRECIOS PENDIENTES DE CERRAR
            </span>
          </div>
          <div className="mt-10 flex flex-col gap-4 lg:mt-12">
            {stlPacks.map((pack) => (
              <StlRow key={pack.slug} pack={pack} />
            ))}
          </div>
        </Container>
      </div>

      {/* 02 · Documentación y licencia */}
      <Container className="py-16 lg:py-20">
        <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
          02 — DOCUMENTACIÓN Y LICENCIA
        </div>
        <h2 className="mt-5 text-[28px] leading-[1.14] font-semibold tracking-[-0.02em] lg:text-[36px]">
          Antes de imprimir
        </h2>
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3">
          <DocCard
            tag="SOLO EN /STL"
            title="Guía de configuración de impresión"
            description="Perfiles de impresora y laminador, altura de capa, soportes y orientación recomendada por tipo de pieza."
            cta="Descargar guía"
            variant="primary"
          />
          <DocCard
            tag="COMÚN AL SISTEMA"
            title="Ficha técnica general"
            description="Medidas, renders, montaje y cuidado del material. La misma que acompaña a los packs físicos y a Slider System."
            cta="Descargar ficha"
            variant="secondary"
          />
          <div className="flex flex-col border border-dashed border-border-hairline p-7">
            <div className="font-mono text-[10.5px] tracking-[0.13em] text-accent">
              LICENCIA DE USO
            </div>
            <div className="mt-5 text-xl font-medium tracking-[-0.015em]">
              Uso personal, no comercial
            </div>
            <p className="mt-3 text-sm leading-[1.6] text-muted">
              Sin DRM: el archivo se entrega íntegro y la restricción es contractual, no técnica.
              La aceptación se pide una sola vez, en el checkout.
            </p>
            <div className="mt-auto pt-6 font-mono text-[11px] text-muted-3">
              [Texto de licencia — pendiente]
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

function KpiField({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-background p-[18px]">
      <div className="font-mono text-[10.5px] tracking-[0.14em] text-muted-3">{label}</div>
      <div className={`mt-1.5 text-xl font-medium ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function DocCard({
  tag,
  title,
  description,
  cta,
  variant,
}: {
  tag: string;
  title: string;
  description: string;
  cta: string;
  variant: "primary" | "secondary";
}) {
  return (
    <div className="flex flex-col border border-border-hairline p-7 transition-[border-color,background] duration-[250ms] hover:border-accent hover:bg-surface-card-hover">
      <div className="flex items-center justify-between">
        <FileText className="size-[26px] text-accent" strokeWidth={1.4} />
        <span className="font-mono text-[10px] tracking-[0.13em] text-muted-3">{tag}</span>
      </div>
      <div className="mt-5 text-xl font-medium tracking-[-0.015em]">{title}</div>
      <p className="mt-3 text-sm leading-[1.6] text-muted">{description}</p>
      <div className="mt-auto pt-6 font-mono text-[10.5px] tracking-[0.1em] text-muted-3">
        PDF · [XX] PÁG · [X,X MB]
      </div>
      <Button variant={variant} className="mt-4 w-full" asChild>
        <a href="#">{cta}</a>
      </Button>
    </div>
  );
}
