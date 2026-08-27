import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingSlotsPanel } from "@/components/site/floating-slots-panel";

import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Brutal Work Studio",
  description:
    "Escenografía modular 3D para Warhammer 40.000. Slider System™: unión dovetail sin pegamento, ángulos de 90º estables durante toda la partida.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${archivo.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <FloatingSlotsPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
