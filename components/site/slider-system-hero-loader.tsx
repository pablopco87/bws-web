"use client";

import dynamic from "next/dynamic";

import { PhotoPlaceholder } from "@/components/site/photo-placeholder";

/**
 * `next/dynamic(..., { ssr: false })` must be called from a Client Component — this wrapper
 * exists only so app/slider-system/page.tsx can stay a Server Component. The canvas can't be
 * rendered on the server anyway (needs `window`/WebGL), so skipping SSR here costs nothing.
 */
export const SliderSystemHero = dynamic(
  () => import("@/components/site/slider-system-hero").then((m) => m.SliderSystemHero),
  {
    ssr: false,
    loading: () => (
      <PhotoPlaceholder
        aspect="4/3"
        className="min-h-[420px] flex-1"
        label="CARGANDO GEOMETRÍA"
        caption="FD2pA + FD2pB · UNIÓN DOVETAIL REAL"
      />
    ),
  }
);
