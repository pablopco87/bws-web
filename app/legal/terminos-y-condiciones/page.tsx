import type { Metadata } from "next";

import { Breadcrumb } from "@/components/site/breadcrumb";
import { Container } from "@/components/site/container";
import { LiveDot } from "@/components/site/live-dot";

export const metadata: Metadata = {
  title: "Términos y condiciones de venta · Brutal Work Studio",
  description:
    "Precios, forma de pago, plazos de fabricación, envío, desistimiento y garantía en Brutal Work Studio.",
};

/**
 * content/legal-borrador-bws.md §3 — texto cerrado, tal cual, con una excepción explícita: la
 * nota entre paréntesis dirigida a Pablo dentro de "Desistimiento" (sobre confirmarla con su
 * gestor) es una nota interna de revisión, no contenido para el usuario final — se retira de
 * aquí. El resto de la cláusula de desistimiento, y todo lo demás, se publica tal cual.
 */
export default function TerminosYCondicionesPage() {
  return (
    <>
      <Breadcrumb
        items={[{ label: "INICIO", href: "/" }, { label: "TÉRMINOS Y CONDICIONES" }]}
      />

      <Container className="pt-16 pb-20 lg:pt-[120px] lg:pb-[120px]">
        <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] text-muted-3">
          <LiveDot />
          LEGAL
        </div>
        <h1 className="mt-6 max-w-[680px] text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-[56px] lg:leading-[1.08]">
          Términos y condiciones de venta
        </h1>

        <div className="mt-10 max-w-[680px] space-y-8 lg:mt-14">
          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Precios</strong>: todos los precios
            mostrados en la web incluyen IVA. El resumen del pedido puede desglosar precio, envío
            e IVA como información adicional, pero el total nunca supera lo mostrado en la página
            de producto.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Forma de pago actual</strong>:
            mientras el negocio opera en fase de validación previa al alta como autónomo, el
            cobro se gestiona de forma manual — al reservar, se envía un email con los métodos de
            pago disponibles. La fabricación arranca al confirmarse el pago de la señal; el resto
            del importe se abona cuando el pedido está fabricado y listo para envío.{" "}
            <em>
              (Esta sección se actualizará cuando se active el cobro automatizado vía Stripe.)
            </em>
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">
              Reserva y turno de fabricación
            </strong>
            : al reservar sin pago inmediato, el turno se mantiene un máximo de 5 días desde la
            notificación; pasado ese plazo sin confirmar el pago de la señal, el turno pasa al
            siguiente pedido en cola.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Plazos de fabricación</strong>: 6-7
            días laborables desde la confirmación del pago de la señal, más el tiempo de envío.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Envío</strong>: solo a Península —
            quedan excluidos Baleares, Canarias, Ceuta y Melilla. Tarifa plana indicada en el
            resumen del pedido.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Desistimiento</strong>: el usuario
            dispone de un plazo de 14 días naturales desde la recepción del producto para
            desistir de la compra, conforme a la normativa de consumo vigente. Dado que la
            fabricación de cada pedido comienza inmediatamente después de confirmarse el pago de
            la señal, a petición expresa del usuario antes de que finalice el plazo de
            desistimiento, si el desistimiento se ejercita una vez iniciada la fabricación, el
            importe de la señal ya abonada podrá destinarse a cubrir los costes de fabricación
            generados hasta ese momento, sin perjuicio del reembolso de cualquier cantidad
            adicional abonada por encima de dicho importe. Al confirmar la reserva, el usuario
            presta su consentimiento expreso a este inicio anticipado de la fabricación. Los
            archivos STL, al ser contenido digital, no son objeto de desistimiento una vez
            descargados con el consentimiento expreso previo del usuario.
          </p>

          <p className="text-lg leading-[1.6] text-muted lg:text-xl lg:leading-[1.72]">
            <strong className="font-medium text-foreground">Garantía</strong>: los productos
            físicos cuentan con la garantía legal de conformidad de 3 años prevista en la
            normativa de consumo española.
          </p>
        </div>
      </Container>
    </>
  );
}
