"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { CompareSlider } from "@/components/site/compare-slider";

const SLIDES = [
  { dotLabel: "Detalle del grabado", caption: "01 · DETALLE DEL GRABADO" },
  { dotLabel: "Plano GW vs montaje", caption: "02 · PLANO GW / MONTADO · ARRASTRA PARA COMPARAR" },
];

const CODES = ["AB", "CD", "EF", "GH"];

/** design/project/Slider System BWS.dc.html §04 — carrusel (detalle / comparador) + codificación. */
export function SliderSystemCoding() {
  const [slide, setSlide] = useState(0);

  return (
    <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[620px_1fr] lg:items-start lg:gap-14">
      <div>
        {slide === 0 ? (
          <PhotoPlaceholder
            aspect="3/2"
            label="PENDIENTE"
            caption="MACRO DE LA BASE DEL MURO · CÓDIGO EN BAJO RELIEVE · LUZ RASANTE PARA QUE SE LEA EL GRABADO"
          />
        ) : (
          <CompareSlider
            beforeLabel="PENDIENTE"
            beforeCaption="PLANO DEL LAYOUT OFICIAL DE GW · CON LOS CÓDIGOS SOBRE EL PLANO"
            afterLabel="PENDIENTE"
            afterCaption="MISMO LAYOUT MONTADO CON NUESTRAS PIEZAS · VISTA CENITAL · MISMO ENCUADRE Y ESCALA"
          />
        )}
        <div className="flex items-center justify-between gap-5 border border-t-0 border-border-hairline px-[22px] py-4">
          <div className="flex items-center gap-3">
            {SLIDES.map((s, i) => (
              <button
                key={s.dotLabel}
                type="button"
                aria-label={s.dotLabel}
                onClick={() => setSlide(i)}
                className={`size-2 border transition-colors ${
                  i === slide ? "border-accent bg-accent" : "border-border hover:border-accent"
                }`}
              />
            ))}
            <span className="ml-2 font-mono text-[10.5px] tracking-[0.12em] text-muted-3">
              {SLIDES[slide].caption}
            </span>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => setSlide((s) => (s + SLIDES.length - 1) % SLIDES.length)}
              className="flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <ArrowLeft className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
              className="flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="max-w-[460px] text-[26px] leading-[1.3] font-medium tracking-[-0.02em]">
          Cada ruina en L lleva su código grabado en la cara inferior.
        </div>
        <p className="mt-4.5 max-w-[460px] text-[15px] leading-[1.62] text-muted">
          El código corresponde a la nomenclatura de los layouts oficiales de Games Workshop. Al
          montar, se lee el plano, se busca la letra y la pieza va donde tiene que ir — sin
          comparar siluetas ni medir distancias sobre la mesa.
        </p>
        <p className="mt-3.5 max-w-[460px] text-[15px] leading-[1.62] text-muted">
          Va en bajo relieve, no impreso: no se borra al manipular la pieza ni al pintarla.
        </p>

        <div className="mt-9 flex items-center gap-5">
          {CODES.map((code) => (
            <div
              key={code}
              className="flex size-[74px] items-center justify-center rounded-full border border-accent font-mono text-2xl font-medium tracking-[0.08em] text-accent"
            >
              {code}
            </div>
          ))}
        </div>
        <div className="mt-3.5 font-mono text-[10.5px] tracking-[0.12em] text-muted-3">
          MISMO CÍRCULO QUE EN LOS ESQUEMAS DE LAYOUT DE GW
        </div>
        <div className="mt-5 font-mono text-[11px] tracking-[0.12em] text-accent">
          LISTADO COMPLETO DE CÓDIGOS PENDIENTE DE CERRAR
        </div>
      </div>
    </div>
  );
}
