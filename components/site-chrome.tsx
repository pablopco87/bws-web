"use client";

import { usePathname } from "next/navigation";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * Sanity Studio (/studio) quiere control total del viewport — sin el header/footer/theme del
 * sitio alrededor. app/layout.tsx es el único root layout (Next exige exactamente uno con
 * html/body), así que la exclusión se decide aquí por ruta en vez de mover las páginas
 * existentes a un route group. `children` sigue renderizado en servidor en ambas ramas — sin
 * riesgo de hydration mismatch, usePathname() coincide entre SSR y cliente porque ambos arrancan
 * de la misma URL.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </ThemeProvider>
  );
}
