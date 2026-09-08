import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";
import { FloatingSlotsPanel } from "@/components/site/floating-slots-panel";
import { HomeHero } from "@/components/site/home-hero-loader";
import { LiveDot } from "@/components/site/live-dot";
import { PackCard } from "@/components/site/pack-card";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { blogEnabled } from "@/lib/site-config";
import { packs } from "@/lib/data/packs";

const mesaPacks = packs.filter((p) => p.category === "mesa");
const piezasPacks = packs.filter((p) => p.category === "piezas");

/**
 * Home — design/project/Home BWS.dc.html (artboard 2a, único) + design/chats/chat1.md:11-30 (el
 * brief más explícito del bundle: jerarquía de mensaje y orden de secciones "cerrado, no lo
 * cambies"). Siete secciones + hero, en ese orden exacto — ver el propio archivo de chat para el
 * razonamiento detrás de cada una.
 *
 * El hero reutiliza lib/wireframe.ts (mismo loader que Slider System, sin tocarlo) pero es su
 * propio componente (components/site/home-hero.tsx): geometría distinta (FC1a_mm/FC1O_mm, no
 * FD2pA_mm/FD2pB_mm) e interacción distinta (bucle automático + paralaje de ratón, sin arrastre
 * ni control manual — Slider System es al revés, quieto salvo interacción). Son dos
 * comportamientos de producto distintos, cerrados así en sus propios mockups.
 */
export default function Home() {
  return (
    <>
      {/* 01 · Hero */}
      <div className="relative overflow-hidden border-b border-border-divider">
        <div className="absolute inset-0">
          <HomeHero />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--color-background) 0%, color-mix(in srgb, var(--color-background) 90%, transparent) 42%, color-mix(in srgb, var(--color-background) 45%, transparent) 68%, transparent 100%)",
          }}
        />

        <Container className="relative pt-24 pb-20 lg:pt-[132px] lg:pb-24">
          <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
            <LiveDot />
            WARHAMMER 40.000 · JUEGO COMPETITIVO · SLIDER SYSTEM™
          </div>
          <h1 className="mt-8 max-w-4xl text-[52px] leading-[0.98] font-semibold tracking-[-0.035em] lg:text-[80px] lg:leading-[0.94]">
            Escenografía modular
            <br />
            para juego competitivo
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-[1.55] text-muted lg:text-xl">
            Unión mecánica en cola de milano. Se monta y se desmonta sin pegamento ni bisagras, y
            aguanta la partida entera.
          </p>

          <div className="mt-14 grid max-w-3xl gap-10 border-t border-border-divider pt-8 sm:grid-cols-2 lg:mt-20">
            <div className="sm:border-r sm:border-border-divider sm:pr-10">
              <div className="font-mono text-[11.5px] tracking-[0.14em] text-accent">
                01 — ESTABILIDAD
              </div>
              <div className="mt-4 text-2xl leading-[1.15] font-medium tracking-[-0.02em] lg:text-[32px]">
                Ángulos de 90º estables durante toda la partida
              </div>
              <p className="mt-3 text-[15px] leading-[1.55] text-muted">
                La unión no pierde firmeza con el uso. Ni bisagra que se abra ni pegamento que
                ceda a mitad de ronda.
              </p>
            </div>
            <div>
              <div className="font-mono text-[11.5px] tracking-[0.14em] text-accent">
                02 — MEDIDAS OFICIALES
              </div>
              <div className="mt-4 text-2xl leading-[1.15] font-medium tracking-[-0.02em] lg:text-[32px]">
                Piezas ajustadas al estándar de mesa de torneo
              </div>
              <p className="mt-3 text-[15px] leading-[1.55] text-muted">
                Cotas de competición, no escalados aproximados. Cada muro cae donde el layout
                dice que cae.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 lg:mt-14">
            <Button variant="primary" asChild>
              <Link href="/packs">Ver packs</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/slider-system">Cómo funciona el Slider System</Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* 02 · Refuerzo inmediato */}
      <div className="border-b border-border-divider bg-surface-alt py-20 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <PhotoPlaceholder
                aspect="1/1"
                label=""
                caption="MONTAJE DE LA UNIÓN DOVETAIL · VÍDEO 1:1 · BUCLE · SIN SONIDO"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] text-accent">
                <LiveDot />
                LOOP
              </div>
            </div>

            <div>
              <div className="mb-11">
                <div className="font-mono text-[11.5px] tracking-[0.14em] text-muted-3">
                  EL MECANISMO
                </div>
                <Image
                  src="/logos/sss.svg"
                  alt="Slider System"
                  width={360}
                  height={92}
                  className="bws-logo mt-6 h-16 w-auto lg:h-[92px]"
                />
                <p className="mt-7 max-w-md text-base leading-[1.55] text-muted">
                  Una unión en cola de milano que se monta a mano, aguanta la partida y luego
                  viaja plana.
                </p>
              </div>

              <Accordion type="single" collapsible defaultValue="montaje" className="border-t border-border-hairline">
                <AccordionItem value="montaje">
                  <AccordionTrigger className="py-6">
                    <span className="flex flex-1 items-baseline gap-5">
                      <span className="w-[100px] shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted-3">
                        MONTAJE
                      </span>
                      <span className="text-xl font-medium tracking-[-0.015em] lg:text-[26px]">
                        Sin ambigüedad de piezas
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-6 text-[15px] leading-[1.55] text-muted sm:pl-[120px]">
                    Hembra del dovetail en los dos lados y ruinas en L codificadas según los
                    layouts oficiales.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="durabilidad">
                  <AccordionTrigger className="py-6">
                    <span className="flex flex-1 items-baseline gap-5">
                      <span className="w-[100px] shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted-3">
                        DURABILIDAD
                      </span>
                      <span className="text-xl font-medium tracking-[-0.015em] lg:text-[26px]">
                        Mejor trato de mesa que el MDF
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-6 text-[15px] leading-[1.55] text-muted sm:pl-[120px]">
                    No astilla cantos ni se deslamina, y la unión no se afloja de montarla cada
                    semana.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="transporte" className="border-b-0">
                  <AccordionTrigger className="py-6">
                    <span className="flex flex-1 items-baseline gap-5">
                      <span className="w-[100px] shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted-3">
                        TRANSPORTE
                      </span>
                      <span className="text-xl font-medium tracking-[-0.015em] lg:text-[26px]">
                        Desmontado ocupa una fracción
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-6 text-[15px] leading-[1.55] text-muted sm:pl-[120px]">
                    Los muros viajan planos y apilados: una mesa entera cabe en una caja.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </Container>
      </div>

      {/* 03 · Prueba social */}
      <Container className="py-16 lg:py-20">
        <div className="grid min-w-0 gap-12 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <div className="mb-6 font-mono text-[11.5px] tracking-[0.14em] text-muted-3">
              EN MESA
            </div>
            <div className="border-l-2 border-accent pl-7">
              <p className="text-[22px] leading-[1.35] text-foreground/85 lg:text-[26px]">
                &ldquo;
                <span className="font-mono text-[15px] tracking-[0.03em] text-muted-3">
                  [PLACEHOLDER — TESTIMONIO REAL PENDIENTE. 2-3 líneas de un jugador sobre
                  estabilidad o velocidad de montaje.]
                </span>
                &rdquo;
              </p>
              <div className="mt-5 font-mono text-xs tracking-[0.06em] text-muted">
                [NOMBRE] · [CLUB / TORNEO]
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-6 flex items-baseline justify-between">
              <div className="font-mono text-[11.5px] tracking-[0.14em] text-muted-3">
                DESDE LA COMUNIDAD
              </div>
              <a
                href="https://instagram.com"
                className="group inline-flex items-center gap-[7px] text-sm text-accent transition-colors duration-200 hover:text-link-hover"
              >
                Ver en Instagram
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3">
              {[
                "CLIP · montaje en 40 s",
                "FOTO · mesa de torneo",
                "CLIP · unión dovetail",
                "FOTO · pack desmontado",
              ].map((caption) => (
                <div key={caption} className="w-[170px] shrink-0">
                  <PhotoPlaceholder aspect="4/5" label="" caption={caption} />
                </div>
              ))}
            </div>
            <div className="mt-2 font-mono text-[11px] text-muted-3">
              SCROLL LATERAL · CONTENIDO REAL DE REDES
            </div>
          </div>
        </div>
      </Container>

      {/* 04 · Teaser de packs */}
      <div className="border-t border-border-divider bg-surface-alt py-16 lg:py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 lg:mb-11">
            <h2 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[44px]">
              Monta tu mesa
            </h2>
            <span className="font-mono text-[11.5px] tracking-[0.12em] text-muted-3 uppercase">
              Precios provisionales
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {mesaPacks.map((pack) => (
              <PackCard key={pack.slug} pack={pack} size="large" />
            ))}
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {piezasPacks.map((pack) => (
              <PackCard key={pack.slug} pack={pack} size="small" />
            ))}
          </div>

          <Link
            href="/stl"
            className="group mt-6 flex flex-col items-start gap-6 border border-border-hairline bg-gradient-to-r from-accent/[0.08] to-transparent p-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-mono text-[11px] tracking-[0.14em] text-accent">
                DESCARGA DIGITAL
              </div>
              <div className="mt-2.5 text-xl font-medium tracking-[-0.02em] lg:text-[26px]">
                ¿Imprimes tú? Los mismos packs en STL
              </div>
            </div>
            <span className="inline-flex h-[52px] shrink-0 items-center border border-accent px-[26px] text-[15px] font-medium text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-on-accent">
              Ver archivos STL
            </span>
          </Link>
        </Container>
      </div>

      {/* 05 · Transparencia */}
      <Container className="py-16 lg:py-20">
        <div className="mb-9 font-mono text-[11.5px] tracking-[0.14em] text-muted-3">
          CÓMO SE FABRICA
        </div>
        <div className="grid gap-px overflow-hidden border border-border-hairline bg-border-hairline sm:grid-cols-3">
          <div className="bg-background p-8">
            <div className="font-mono text-[32px] font-medium tracking-[-0.02em] text-accent">
              1/1
            </div>
            <div className="mt-4 text-xl font-medium">Control de calidad pieza a pieza</div>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-muted">
              Cada pieza se revisa a mano antes de empaquetar: encaje del dovetail, planitud de
              la base y limpieza de cantos.
            </p>
          </div>
          <div className="bg-background p-8">
            <div className="font-mono text-[32px] font-medium tracking-[-0.02em] text-accent">
              6-7 d
            </div>
            <div className="mt-4 text-xl font-medium">Plazo de fabricación</div>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-muted">
              Se imprime por encargo. Los pedidos entran por tandas con un número fijo de slots;
              al llenarse una tanda, la siguiente abre con fecha.
            </p>
            <Link
              href="/faq"
              className="group mt-4 inline-flex items-center gap-[7px] text-sm text-accent transition-colors duration-200 hover:text-link-hover"
            >
              Detalle en FAQ
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="bg-background p-8">
            <div className="font-mono text-[32px] font-medium tracking-[-0.02em] text-accent">
              PLA
            </div>
            <div className="mt-4 text-xl font-medium">Bambu Lab A1 · gris</div>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-muted">
              Un material y un color en todo el catálogo. Cualquier pieza de cualquier pack
              encaja con las que ya tienes.
            </p>
          </div>
        </div>
      </Container>

      {/* 06 · Origen */}
      <div className="border-t border-border-divider bg-surface-alt py-16 lg:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[200px_1fr] lg:gap-14">
            <div className="font-mono text-[11.5px] tracking-[0.14em] text-muted-3">ORIGEN</div>
            <div className="max-w-3xl">
              <p className="text-2xl leading-[1.42] text-foreground/85 lg:text-[28px]">
                Empezamos porque nos cansamos de recolocar muros entre turnos. Todo lo que
                vendemos salió de un problema que tuvimos jugando, resuelto en la mesa antes de
                resolverlo en el ordenador.
              </p>
              <Link
                href="/sobre-nosotros"
                className="group mt-6 inline-flex items-center gap-[7px] text-sm text-accent transition-colors duration-200 hover:text-link-hover"
              >
                Sobre nosotros
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* 07 · Blog — oculto hasta que haya contenido editorial (mismo flag que el footer) */}
      {blogEnabled && (
        <Container className="border-t border-border-divider py-[88px] opacity-[0.34]">
          <div className="mb-7 flex flex-wrap items-center gap-3.5">
            <span className="border border-dashed border-muted px-2 py-1 font-mono text-[10.5px] tracking-[0.12em] text-muted">
              OCULTO · NO PUBLICADO
            </span>
            <span className="text-xl font-medium">Blog</span>
            <span className="font-mono text-[11.5px] text-muted-3">
              se activa en el lanzamiento editorial
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="h-[150px] border border-dashed border-border-hairline" />
            <div className="h-[150px] border border-dashed border-border-hairline" />
            <div className="h-[150px] border border-dashed border-border-hairline" />
          </div>
        </Container>
      )}

      <FloatingSlotsPanel />
    </>
  );
}
