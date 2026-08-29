import { Container } from "@/components/site/container";
import { FloatingSlotsPanel } from "@/components/site/floating-slots-panel";

/**
 * Minimal placeholder — just enough page body to check the shell (header, mega-menu, theme
 * toggle, footer) together in a browser. Real Home page content comes later.
 *
 * FloatingSlotsPanel is opted into per-page (not in the root layout) — not every page shows it,
 * e.g. /faq doesn't. Real Home will keep rendering it here when it's built for real.
 */
export default function Home() {
  return (
    <>
      <Container className="flex flex-col gap-6 py-24">
        <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">
          BWS · COMPONENT PREVIEW
        </div>
        <h1 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] lg:text-6xl">
          Tokens y componentes de layout listos.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Cabecera con mega-menú de Packs, interruptor de tema, pie y panel flotante de
          disponibilidad de slots ya están montados sobre los tokens de Foundations. Prueba el
          interruptor de tema arriba a la derecha, abre &ldquo;Packs&rdquo; y reduce la ventana
          para ver el comportamiento mobile.
        </p>
      </Container>
      <FloatingSlotsPanel />
    </>
  );
}
