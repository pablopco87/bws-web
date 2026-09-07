import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sobre nosotros · Brutal Work Studio",
  description:
    "Por qué existe Brutal Work Studio, cómo nace el Slider System y los cuatro pilares que deciden qué entra al catálogo.",
};

const pillars = [
  {
    number: "01",
    title: "Estabilidad",
    description:
      "Una pieza que hay que recolocar durante la partida está mal resuelta. El acople tiene que aguantar empujones, dados y codos.",
    where:
      "Dovetail de perfil ancho y base con footprint amplio: la pieza alta apoya sobre la misma huella que la baja.",
  },
  {
    number: "02",
    title: "Funcionalidad",
    description:
      "La escenografía existe para jugar. Si estorba la línea de visión, no cabe una miniatura o bloquea un movimiento legal, sobra.",
    where:
      "Ruinas en L con interior despejado y piezas bajas del mismo footprint que las altas: se intercambian sin recolocar la mesa.",
  },
  {
    number: "03",
    title: "Durabilidad",
    description:
      "Esto se monta y desmonta cientos de veces. Cada elemento añadido —bisagra, imán, adhesivo— es un punto de fallo más.",
    where:
      "Cero herrajes en todo el sistema: la unión es geometría impresa, así que no hay nada que se afloje ni que reponer.",
  },
  {
    number: "04",
    title: "Transportabilidad",
    description:
      "Una mesa que no se puede guardar ni llevar al club se usa una vez. El volumen desmontado es un requisito, no una consecuencia.",
    where:
      "Todo desmonta a piezas planas o apilables: la mesa completa entra en caja sin desmontar nada a la fuerza.",
  },
] as const;

/**
 * design/project/Sobre Nosotros BWS.dc.html (turno 11, artboard 11a — la variante "editorial"
 * cerrada; 11b se descartó). Narrativa de origen en primera persona, sin firma ni retrato, sin
 * FloatingSlotsPanel — lo dice la propia nota del artboard.
 */
export default function SobreNosotrosPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "SOBRE NOSOTROS" }]} />

      {/* 1 · Apertura */}
      <Container className="pt-16 lg:pt-[120px]">
        <div className="max-w-[900px]">
          <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
            01 · POR QUÉ EXISTE BWS
          </div>
          <h1 className="mt-6 max-w-[860px] text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[68px] lg:leading-[1.06] lg:tracking-[-0.04em]">
            Empecé a diseñar escenografía porque la que compraba se caía.
          </h1>
        </div>
        <div className="mx-auto mt-10 max-w-[680px] lg:mt-14">
          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            Llevo en el hobby desde los diez años. Primero jugando, luego montando mesas para
            otros, y siempre con el mismo problema: la escenografía modular del mercado no aguanta
            una partida entera. Piezas que se separan al mover un dado, torres que hay que
            recolocar cada turno, muros que se vencen cuando alguien apoya el codo en la mesa.
          </p>
          <p className="mt-8 text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            Trabajo como diseñador de producto UX/UI. Mi oficio es reducir un problema a las
            decisiones que lo resuelven, y llevaba años viendo el mismo problema sin resolver en
            algo que me importa. Brutal Work Studio existe para cerrar esa distancia.
          </p>
        </div>
        <PhotoPlaceholder
          aspect="21/9"
          caption="MESA DE TRABAJO · PLANO GENERAL · PIEZAS, HERRAMIENTA Y CALIBRE SOBRE LA MESA · SIN PERSONAS EN CUADRO"
          className="mt-16 lg:mt-20"
        />
      </Container>

      {/* 2 · De la necesidad a la solución */}
      <Container className="pt-20 lg:pt-[120px]">
        <div className="mx-auto max-w-[680px]">
          <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
            02 · DE LA NECESIDAD A LA SOLUCIÓN
          </div>
          <h2 className="mt-6 text-[28px] leading-[1.14] font-semibold tracking-[-0.03em] lg:text-[44px]">
            El problema no era la pieza. Era la unión.
          </h2>
          <p className="mt-8 text-lg leading-[1.6] text-muted lg:mt-[34px] lg:text-xl lg:leading-[1.72]">
            Probé lo que había: bisagras, imanes, encajes a presión, tableros de MDF con piezas
            pegadas. Todo falla en el mismo punto. La bisagra añade una pieza que se rompe, el
            imán cede en horizontal, el encaje a presión se afloja con el uso y el tablero fijo no
            cabe en ninguna estantería.
          </p>
          <p className="mt-8 text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            La solución llegó al dejar de tratar la unión como un accesorio y empezar a tratarla
            como la pieza principal. Un dovetail impreso en la propia geometría: sin herrajes, sin
            adhesivo, sin nada que comprar aparte. Se acopla deslizando y aguanta la partida. Eso
            es el Slider System.
          </p>
          <Link
            href="/slider-system"
            className="group mt-9 inline-flex items-center gap-[7px] border-b border-accent/32 text-base text-accent transition-colors duration-200 hover:border-link-hover hover:text-link-hover"
          >
            Cómo funciona el Slider System
            <span className="font-mono transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2">
          <PhotoPlaceholder
            aspect="4/3"
            caption="DETALLE · DOS PIEZAS ACOPLÁNDOSE POR EL DOVETAIL · MANOS EN CUADRO, SIN ROSTRO"
          />
          <PhotoPlaceholder
            aspect="4/3"
            caption="MESA JUGABLE MONTADA · PLANO CENITAL · SIN PERSONAS EN CUADRO"
          />
        </div>
      </Container>

      {/* 3 · Los cuatro pilares */}
      <div className="mt-20 border-y border-border-divider bg-surface-alt py-16 lg:mt-[120px] lg:py-[110px]">
        <Container>
          <div className="mx-auto max-w-[680px]">
            <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
              03 · LOS CUATRO PILARES
            </div>
            <h2 className="mt-6 text-[28px] leading-[1.14] font-semibold tracking-[-0.03em] lg:text-[44px]">
              Cuatro criterios que deciden qué entra y qué se descarta.
            </h2>
            <p className="mt-7 text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
              No son valores de marca. Son las cuatro preguntas que le hago a cada pieza antes de
              que llegue al catálogo.
            </p>
          </div>
          <div className="mx-auto mt-12 grid gap-6 lg:mt-16 lg:max-w-[1160px] lg:grid-cols-2">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.number} {...pillar} />
            ))}
          </div>
        </Container>
      </div>

      {/* 4 · Cómo se fabrica */}
      <Container className="pt-20 lg:pt-[110px]">
        <div className="mx-auto max-w-[680px]">
          <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
            04 · CÓMO SE FABRICA
          </div>
          <h2 className="mt-6 text-[28px] leading-[1.14] font-semibold tracking-[-0.03em] lg:text-[44px]">
            Una impresora, una tanda a la vez.
          </h2>
          <p className="mt-8 text-lg leading-[1.6] text-muted lg:mt-[34px] lg:text-xl lg:leading-[1.72]">
            Imprimo yo, en una sola impresora, en mi mesa de trabajo. Cada pack ocupa un slot de
            fabricación y las tandas van una detrás de otra, así que la disponibilidad es literal:
            si el slot está ocupado, no hay stock que sacar de un almacén.
          </p>
          <p className="mt-8 text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            Después de imprimir viene lo que no se ve: retirar soportes, repasar cada acople a
            mano y montar el pack entero antes de empaquetarlo. Si una pieza no desliza como debe,
            no sale.
          </p>
          <Link
            href="/"
            className="group mt-9 inline-flex items-center gap-[7px] border-b border-accent/32 text-base text-accent transition-colors duration-200 hover:border-link-hover hover:text-link-hover"
          >
            Proceso completo y transparencia
            <span className="font-mono transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <div className="mt-14 grid gap-6 pb-20 lg:mt-[72px] lg:grid-cols-2 lg:pb-0">
          <PhotoPlaceholder
            aspect="16/10"
            caption="IMPRESORA EN MARCHA · PLANO MEDIO DE LA CAMA DE IMPRESIÓN · SIN PERSONAS EN CUADRO"
          />
          <PhotoPlaceholder
            aspect="16/10"
            caption="POST-PROCESO · PIEZAS RECIÉN RETIRADAS, REPASO DE ACOPLES · MANOS EN CUADRO, SIN ROSTRO"
          />
        </div>
      </Container>

      {/* 5 · CTA de cierre */}
      <div className="mt-20 border-t border-border-divider bg-surface-alt py-16 lg:mt-[120px] lg:py-[100px]">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
            <div className="max-w-[680px]">
              <h2 className="text-[28px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[44px] lg:tracking-[-0.035em]">
                Si el problema te suena, el sistema te va a encajar.
              </h2>
              <p className="mt-6 text-base leading-[1.6] text-muted lg:mt-[26px] lg:text-lg lg:leading-[1.7]">
                Cinco packs físicos en catálogo, o el sistema explicado pieza a pieza si prefieres
                entenderlo antes de comprar.
              </p>
            </div>
            <div className="flex flex-none gap-3.5">
              <Button asChild variant="solid">
                <Link href="/packs">Ver los packs</Link>
              </Button>
              <Button asChild variant="primary">
                <Link href="/slider-system">Slider System</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

function PillarCard({
  number,
  title,
  description,
  where,
}: {
  number: string;
  title: string;
  description: string;
  where: string;
}) {
  return (
    <div className="border border-border-hairline p-8 transition-[border-color,background] duration-[250ms] hover:border-accent hover:bg-surface-card-hover lg:p-9">
      <div className="flex items-baseline gap-3.5">
        <span className="font-mono text-xs tracking-[0.14em] text-muted-3">{number}</span>
        <div className="text-2xl font-semibold tracking-[-0.02em] lg:text-[27px]">{title}</div>
      </div>
      <p className="mt-5 text-[15px] leading-[1.68] text-muted lg:text-[17px]">{description}</p>
      <div className="mt-6 border-t border-border-hairline pt-5">
        <div className="font-mono text-[10.5px] tracking-[0.13em] text-muted-3">DÓNDE SE VE</div>
        <p className="mt-2.5 text-sm leading-[1.62] text-muted lg:text-[15.5px]">{where}</p>
      </div>
    </div>
  );
}
