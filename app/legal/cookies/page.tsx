import type { Metadata } from "next";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { LiveDot } from "@/components/site/live-dot";

export const metadata: Metadata = {
  title: "Política de cookies · Brutal Work Studio",
  description:
    "Brutal Work Studio no utiliza cookies en su configuración actual. Preferencia de tema y analítica explicadas aquí.",
};

/**
 * content/legal-borrador-bws.md §4 — texto cerrado, tal cual. Sin cambios de redacción aquí,
 * solo maquetación.
 */
export default function CookiesPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "INICIO", href: "/" }, { label: "COOKIES" }]} />

      <Container className="pt-16 pb-20 lg:pt-[120px] lg:pb-[120px]">
        <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
          <LiveDot />
          LEGAL
        </div>
        <h1 className="mt-6 max-w-[680px] text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[56px] lg:leading-[1.08]">
          Política de cookies
        </h1>

        <div className="mt-10 max-w-[680px] space-y-8 lg:mt-14">
          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            Este sitio web, en su configuración actual,{" "}
            <strong className="font-medium text-foreground">no utiliza cookies</strong>. La
            preferencia de tema claro/oscuro se guarda mediante almacenamiento local del
            navegador (
            <code className="rounded-none bg-surface-alt px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
              localStorage
            </code>
            ), no mediante cookies, y no se transmite a ningún servidor ni se comparte con
            terceros.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            La analítica del sitio se realiza con Vercel Analytics, una herramienta que no
            utiliza cookies ni identificadores persistentes — no rastrea al usuario entre
            sesiones ni entre sitios web, por lo que no está sujeta al deber de información y
            consentimiento del artículo 22.2 de la LSSI-CE. Por el mismo motivo, este sitio no
            muestra un banner de consentimiento de cookies: no haría falta uno mientras esta
            configuración se mantenga así.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            Si en el futuro se incorporan cookies (por ejemplo, las que establece Stripe como
            parte del proceso de pago, necesarias para la prevención de fraude y la propia
            ejecución de la transacción), esta política se actualizará para reflejarlo. Las
            cookies estrictamente necesarias para completar una compra están exentas del deber de
            consentimiento previo, pero igualmente deben quedar informadas aquí en cuanto se
            activen.
          </p>
        </div>
      </Container>
    </>
  );
}
