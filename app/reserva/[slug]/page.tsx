import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { ReservaForm } from "@/components/site/reserva-form";
import { packs } from "@/lib/data/packs";
import { getPackAvailability } from "@/lib/data/slots";

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
  return { title: `Reservar ${pack.name} · Brutal Work Studio` };
}

/**
 * design/project/Checkout Reserva Senal.dc.html (Turno 14, artboards 14a/14b) — el único paso del
 * flujo de reserva/señal que vive en el sitio. Todo lo demás (pago de la señal, resto, envío) se
 * comunica por email, fuera de la web. Disponibilidad calculada aquí con las mismas funciones que
 * ya usan AvailabilityCTA/app/packs/[slug]/page.tsx — nunca una foto pasada por URL.
 */
export default async function ReservaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pack = packs.find((p) => p.slug === slug);
  if (!pack) notFound();
  const availability = getPackAvailability(pack);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "INICIO", href: "/" },
          { label: "PACKS", href: "/packs" },
          { label: pack.name.toUpperCase(), href: `/packs/${pack.slug}` },
          { label: "RESERVA" },
        ]}
      />
      <Container className="py-16 lg:py-20">
        <ReservaForm pack={pack} availability={availability} />
      </Container>
    </>
  );
}
