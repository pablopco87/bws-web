export interface FaqItem {
  /** e.g. "P·01" — shown in the index column instead of a category label. */
  index: string;
  question: string;
  answer: string;
}

/**
 * Verbatim from design/project/FAQ BWS.dc.html (turno 15, /faq) — do not summarize or rewrite.
 * P·07 and P·13 in the original brief were reordered so the "señal" question (now P·08) sits
 * right after the reservation question it depends on; this list already reflects that final
 * order, renumbered P·01–P·13.
 */
export const faqItems: FaqItem[] = [
  {
    index: "P·01",
    question: "¿De qué material está hecha la escenografía?",
    answer:
      "PLA Basic de Bambu Lab en gris, impreso en una Bambu Lab A1. Es un material rígido, con buen acabado de capa y que no astilla los cantos como el MDF.",
  },
  {
    index: "P·02",
    question: "¿Cuánto tarda en llegar mi pedido?",
    answer:
      "Todo se imprime bajo demanda: 6–7 días de fabricación desde la compra o desde la confirmación del pago, más el tiempo de envío. No hay stock guardado en estantería.",
  },
  {
    index: "P·03",
    question: "¿Puedo elegir otro color?",
    answer:
      "Actualmente solo en gris. Es un color neutro, listo para pintar o para jugar tal cual; no hay variantes de color en catálogo.",
  },
  {
    index: "P·04",
    question: "¿Es resistente la unión dovetail?",
    answer:
      "Sí. Mantiene los ángulos de 90º estables durante toda la partida y no pierde firmeza con el montaje y desmontaje repetido.",
  },
  {
    index: "P·05",
    question: "¿Puedo desmontar y volver a montar?",
    answer:
      "Sí, sin pegamento ni herramientas: las piezas se acoplan deslizando y se separan igual. Ese es el punto del Slider System — la mesa se monta, se juega y viaja desmontada.",
  },
  {
    index: "P·06",
    question: "¿Qué pasa si el producto llega defectuoso?",
    answer:
      "Escríbenos con una foto de la pieza y lo resolvemos: reimprimimos y reenviamos lo que haya llegado mal. No hay un proceso formal de garantía de gran comercio; se arregla por email, directamente con quien fabrica la pieza.",
  },
  {
    index: "P·07",
    question: "¿Cómo funciona la reserva de slot de fabricación?",
    answer:
      "La capacidad de impresión es limitada y compartida entre todos los pedidos, así que se trabaja por turnos: cada tanda tiene un número fijo de slots. Si hay slot libre, tu pack entra en la tanda en curso; si está completa, entras en cola para la siguiente. El turno se reserva con el pago de una señal, no con el importe completo por adelantado",
  },
  {
    index: "P·08",
    question: "¿Cómo funciona la señal?",
    answer:
      "El turno se reserva con una señal y el cobro se gestiona de forma manual. Al reservar recibes un email con los métodos de pago disponibles; la fabricación arranca en cuanto se confirma el pago de la señal. A mitad del proceso te enviamos fotos de cómo va el pedido, y el resto del importe se completa cuando la pieza está fabricada y lista para el envío.",
  },
  {
    index: "P·09",
    question: "¿Qué pasa si no pago dentro del plazo tras reservar?",
    answer:
      "Hay 5 días para pagar la señal desde el aviso de turno. Pasado el plazo, el turno se libera y pasa al siguiente de la cola. Puedes volver a reservar cuando quieras, al final de la cola.",
  },
  {
    index: "P·10",
    question: "¿Qué diferencia hay entre comprar el pack físico y el STL?",
    answer:
      "El pack físico llega impreso, revisado y listo para jugar. El STL es el archivo para imprimirlo tú mismo, con tu impresora y tu material, y entra en tu cola, no en la nuestra.",
  },
  {
    index: "P·11",
    question: "¿Puedo usar el STL para fines comerciales?",
    answer:
      "No. La licencia es de uso personal: puedes imprimir para ti las veces que quieras, pero no vender ni distribuir las piezas ni el archivo. El detalle completo está en la página de licencia de uso.",
  },
  {
    index: "P·12",
    question: "¿Qué incluye exactamente cada pack?",
    answer:
      "El contenido pieza a pieza está en la página de cada pack, con medidas y número de módulos. Ahí se actualiza cuando cambia; aquí no se duplica.",
  },
  {
    index: "P·13",
    question: "¿Enviáis fuera de la Península?",
    answer:
      "No. Solo enviamos a Península: quedan fuera Baleares, Canarias, Ceuta y Melilla. Si estás fuera de esa zona, escríbenos antes de comprar y buscamos alternativa.",
  },
];
