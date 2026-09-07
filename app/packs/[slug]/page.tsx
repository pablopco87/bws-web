import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { AvailabilityCTA } from "@/components/site/availability-cta";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { FloatingSlotsPanel } from "@/components/site/floating-slots-panel";
import { PackCard } from "@/components/site/pack-card";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { packs } from "@/lib/data/packs";

export function generateStaticParams() {
  return packs.map((pack) => ({ slug: pack.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pack = packs.find((p) => p.slug === slug);
  if (!pack) return {};
  return {
    title: `${pack.name} · Brutal Work Studio`,
    description: pack.heroClaim ?? pack.description,
  };
}

/** Gallery slot captions — closed, generic across packs (design/project/Packs BWS · Tournament.dc.html §04). */
const GALLERY_CAPTIONS = [
  "MESA MONTADA · PLANO GENERAL",
  "DETALLE DOVETAIL",
  "TEXTURA DE CAPA",
  "SECUENCIA DE MONTAJE",
  "PIEZA SUELTA",
  "ESCALA CON MINIATURA",
  "PACK EMBALADO",
  "PARTIDA EN CURSO",
  "LAYOUT COMPLETO DESDE ARRIBA",
];

/**
 * Product detail template — design/project/Packs BWS · Tournament.dc.html (117KB, read in
 * full). Only Tournament ever got real hero copy in the design tool; the brief says this
 * template "se reutilizará para los otros cuatro packs solo cambiando contenido," but that pass
 * was never done for them, so they reuse their already-closed distributor description as their
 * hero claim (`Pack.heroClaim` falls back to `Pack.description`). "Qué incluye"/"Especificaciones"
 * /"Galería" are 100% placeholder in the source for EVERY pack including Tournament — built here
 * as static grids (not the drag-carousel/piece-selector/lightbox from the mockup) since there's
 * no real piece data yet to make that interactivity worth building.
 */
export default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pack = packs.find((p) => p.slug === slug);
  if (!pack) notFound();

  const otherPacks = packs.filter((p) => p.slug !== pack.slug);

  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "PACKS", href: "/packs" }, { label: pack.name.toUpperCase() }]} />

      {/* 01 · Hero */}
      <Container className="pt-14 pb-16 lg:pt-[72px] lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-accent">
              <span className="size-1.5 rounded-full bg-accent" />
              PACK FÍSICO · {pack.megaLabel} ·{" "}
              {pack.slotCost === "full" ? "1 SLOT" : "1/2 SLOT"} DE FABRICACIÓN
            </div>
            <h1 className="mt-6 text-[44px] leading-[1.02] font-semibold tracking-[-0.03em] lg:text-[84px] lg:leading-[0.98]">
              {pack.name}
            </h1>
            <p className="mt-6 max-w-[480px] text-lg leading-[1.55] text-muted lg:text-xl">
              {pack.heroClaim ?? pack.description}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border-hairline pt-8">
              <MetaField label="CONSUMO" value={pack.slotCost === "full" ? "1 slot completo" : "1/2 slot"} />
              <MetaField label="FABRICACIÓN" value="6–7 días" />
              <MetaField label="MATERIAL" value="PLA Bambu Lab · gris" />
              <MetaField label="PRECIO" value="[PRECIO]" />
            </dl>

            <div className="mt-9 flex flex-wrap items-start gap-x-4 gap-y-4">
              <AvailabilityCTA pack={pack} />
              <Link
                href="#que-incluye"
                className="flex h-[52px] items-center border border-border px-[26px] text-[15px] font-medium transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Ver qué incluye
              </Link>
            </div>
          </div>

          <PhotoPlaceholder
            aspect="4/3"
            label="PENDIENTE"
            caption="RENDER / FOTO PRINCIPAL DEL PACK · PENDIENTE DE PRODUCIR"
          />
        </div>
      </Container>

      {/* 02 · Qué incluye */}
      <div id="que-incluye" className="scroll-mt-20 border-t border-border-divider bg-surface-alt py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="02 — CONTENIDO DEL PACK"
            title="Qué incluye"
            note="LISTADO PENDIENTE DE CONFIRMAR"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-12 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex flex-col border border-border-hairline p-4">
                <PhotoPlaceholder aspect="1/1" label="" caption="RENDER 3/4 · PENDIENTE" />
                <div className="mt-3 font-mono text-[9.5px] tracking-[0.1em] text-muted-3">
                  [BWS-XX-{String(i + 1).padStart(2, "0")}]
                </div>
                <div className="mt-1.5 text-sm font-medium">[NOMBRE DE PIEZA]</div>
                <div className="mt-2 flex justify-between font-mono text-[10.5px] text-muted-3">
                  <span>[XX] UD</span>
                  <span>[XX cm]</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[640px] text-sm leading-[1.6] text-muted lg:mt-10">
            Total de piezas del pack: [XX]. Piezas, medidas y bolsas de entrega pendientes de
            cierre.
          </p>
        </Container>
      </div>

      {/* 03 · Especificaciones técnicas */}
      <Container className="py-16 lg:py-20">
        <SectionHeading
          eyebrow="03 — COTAS Y MATERIAL"
          title="Especificaciones técnicas"
          note="MEDIDAS EN CM · PENDIENTES DE MEDICIÓN FINAL"
        />
        <div className="mt-10 border border-border-hairline p-7 lg:mt-12 lg:p-8">
          <div className="font-mono text-[10.5px] tracking-[0.13em] text-muted-3">
            COMÚN A TODO EL PACK
          </div>
          <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-5">
            <MetaField label="MATERIAL" value="PLA Bambu Lab" small />
            <MetaField label="IMPRESORA" value="Bambu Lab A1" small />
            <MetaField label="COLOR" value="Gris" small />
            <MetaField label="ALTURA DE CAPA" value="[X,XX mm]" small />
            <MetaField label="TOLERANCIA" value="[±X,XX mm]" small />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="border border-border-hairline p-6">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted-3">
                  PIEZA {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] text-muted-3">[BWS-XX-{String(i + 1).padStart(2, "0")}]</span>
              </div>
              <div className="mt-2 text-base font-medium">[NOMBRE DE PIEZA]</div>
              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-border-hairline pt-4">
                {["ANCHO", "ALTO", "FONDO", "LDV"].map((m) => (
                  <div key={m}>
                    <div className="font-mono text-[9px] tracking-[0.1em] text-muted-3">{m}</div>
                    <div className="mt-1 font-mono text-xs">[XX cm]</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* 04 · Galería */}
      <div className="border-t border-border-divider bg-surface-alt py-16 lg:py-20">
        <Container>
          <SectionHeading eyebrow="04 — GALERÍA" title="Detalle" note="9 HUECOS · PENDIENTES" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-12">
            {GALLERY_CAPTIONS.map((caption, i) => (
              <PhotoPlaceholder
                key={caption}
                aspect="4/3"
                label={`${String(i + 1).padStart(2, "0")} · PENDIENTE`}
                caption={caption}
              />
            ))}
          </div>
        </Container>
      </div>

      {/* 05 · Slider System aplicado */}
      <Container className="py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
              05 — SLIDER SYSTEM™ APLICADO
            </div>
            <h2 className="mt-5 text-[28px] leading-[1.14] font-semibold tracking-[-0.02em] lg:text-[36px]">
              Cómo encaja este pack
            </h2>
            <p className="mt-5 text-base leading-[1.6] text-muted lg:text-lg">
              Todas las piezas de {pack.name} comparten el mismo perfil de cola de milano, así que
              se combinan entre sí y con cualquier otro pack del catálogo.
            </p>
            <div className="mt-8 flex flex-col gap-6">
              <SliderPoint
                title="Deslizamiento vertical"
                description="La pieza entra desde arriba y queda bloqueada en el eje horizontal."
              />
              <SliderPoint
                title="Sin pegamento ni bisagras"
                description="Montaje y desmontaje ilimitados para transporte en caja plana."
              />
              <SliderPoint
                title="Compatible con el resto del catálogo"
                description="Perfil común: cualquier pieza BWS encaja con cualquier otra."
              />
            </div>
            <Link
              href="/slider-system"
              className="mt-8 inline-flex h-[52px] items-center border border-accent px-[26px] text-[15px] font-medium text-accent transition-colors duration-200 hover:bg-accent hover:text-on-accent"
            >
              Ver el Slider System en detalle
            </Link>
          </div>
          <PhotoPlaceholder aspect="4/3" label="" caption="DIAGRAMA DE ENCAJE · PLACEHOLDER" />
        </div>
      </Container>

      {/* 06 · Proceso de fabricación */}
      <div className="border-t border-border-divider bg-surface-alt py-16 lg:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
                06 — FABRICACIÓN
              </div>
              <h2 className="mt-5 text-[28px] leading-[1.14] font-semibold tracking-[-0.02em] lg:text-[36px]">
                Qué pasa cuando reservas
              </h2>
            </div>
            <Link
              href="/"
              className="group inline-flex items-center gap-[7px] border-b border-accent/32 text-accent transition-colors duration-200 hover:border-link-hover hover:text-link-hover"
            >
              Proceso completo en Transparencia
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-border-hairline bg-border-hairline sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            <ProcessStep day="DÍA 0" title="Reserva del slot" description="El slot queda bloqueado a tu nombre y desaparece del módulo de estado." />
            <ProcessStep day="DÍAS 1–5" title="Impresión de la tanda" description="PLA Bambu Lab en A1, una familia de piezas por bandeja." />
            <ProcessStep day="DÍA 6" title="Revisión pieza a pieza" description="Encaje del dovetail, planitud de base y limpieza de cantos, a mano." />
            <ProcessStep day="DÍA 7" title="Empaquetado y envío" description="Bolsas separadas por familia y número de seguimiento por correo." />
          </div>
        </Container>
      </div>

      {/* 07 · Cross-selling */}
      <Container className="py-16 lg:py-20">
        <SectionHeading
          eyebrow="07 — OTROS PACKS FÍSICOS"
          title="Completa la mesa"
          note="PRECIOS PROVISIONALES · [PLACEHOLDER]"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {otherPacks.map((p) => (
            <PackCard key={p.slug} pack={p} size="small" />
          ))}
        </div>
      </Container>

      <FloatingSlotsPanel packMode />
    </>
  );
}

function MetaField({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.12em] text-muted-3">{label}</div>
      <div className={small ? "mt-1.5 text-sm" : "mt-1.5 text-lg font-medium"}>{value}</div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">{eyebrow}</div>
        <h2 className="mt-5 text-[28px] leading-[1.14] font-semibold tracking-[-0.02em] lg:text-[36px]">
          {title}
        </h2>
      </div>
      <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted-3 uppercase">{note}</span>
    </div>
  );
}

function SliderPoint({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-t border-border-hairline pt-5">
      <div className="text-base font-semibold">{title}</div>
      <p className="mt-2 text-[15px] leading-[1.55] text-muted">{description}</p>
    </div>
  );
}

function ProcessStep({
  day,
  title,
  description,
}: {
  day: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background p-6 lg:p-7">
      <div className="font-mono text-[11px] tracking-[0.12em] text-accent">{day}</div>
      <div className="mt-3 text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-[1.55] text-muted">{description}</p>
    </div>
  );
}
