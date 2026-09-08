"use client";

import dynamic from "next/dynamic";

/**
 * `next/dynamic(..., { ssr: false })` must be called from a Client Component — same wrapper
 * pattern as slider-system-hero-loader.tsx, so app/page.tsx can stay a Server Component. No
 * placeholder needed here (unlike Slider System's viewer): this hero sits behind hero copy as a
 * decorative background, so an empty canvas area while the chunk/data load is unnoticeable.
 */
export const HomeHero = dynamic(
  () => import("@/components/site/home-hero").then((m) => m.HomeHero),
  { ssr: false }
);
