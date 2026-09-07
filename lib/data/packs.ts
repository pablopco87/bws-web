export type SlotCost = "full" | "half";
export type PackCategory = "mesa" | "piezas";

export interface Pack {
  slug: string;
  name: string;
  /** Short label shown under the pack name in the mega-menu, e.g. "MESA COMPLETA". */
  megaLabel: string;
  category: PackCategory;
  slotCost: SlotCost;
  /** Short closed description — the /packs catalog card copy. Doubles as the product-page hero
   *  claim for packs that don't have one of their own (see `heroClaim`). */
  description: string;
  /**
   * Product-page hero claim, only closed for Tournament (design/project/Packs BWS ·
   * Tournament.dc.html) — the other four packs never got their own template pass in the design
   * tool, so their product page reuses `description` instead of inventing new marketing copy.
   */
  heroClaim?: string;
  /**
   * Piece count — closed only for Ruined Buildings (the one real content number across the
   * whole catalog: design/project/Packs BWS.dc.html, chat4.md). Everywhere else this is an
   * explicit "—" placeholder, not a number to invent.
   */
  pieceCount?: number;
  /** Schematic wireframe icon for the mega-menu preview, viewBox "0 0 200 140". */
  icon: string[];
}

/**
 * The five physical packs, closed order per brief (chat3/chat4):
 * Tournament, Battle Ready, Ruined Buildings, Blockers & Barricadas, Rubble Walls.
 *
 * Slot cost: brief text (chat4) states Battle Ready = 1/2 slot ("media mesa"); the shipped
 * header markup in Home BWS.dc.html shows it as a full-slot badge instead — an unresolved
 * inconsistency in the design bundle. Following the explicit, repeated brief text here.
 */
export const packs: Pack[] = [
  {
    slug: "tournament",
    name: "Tournament",
    megaLabel: "MESA COMPLETA",
    category: "mesa",
    slotCost: "full",
    description:
      "Cobertura de mesa completa para partida de torneo. Desglose de piezas pendiente de cierre.",
    heroClaim:
      "Mesa de torneo completa en un solo pedido. Muros, ruinas y bloqueadores con unión Slider System, listos para montar un layout oficial sin pegamento.",
    icon: [
      "M24 96 L100 56 L176 96 L100 136 Z",
      "M24 96 V60 L100 20 L176 60 v36",
      "M100 20 V56",
    ],
  },
  {
    slug: "battle-ready",
    name: "Battle Ready",
    megaLabel: "MEDIA MESA",
    category: "mesa",
    slotCost: "half",
    description:
      "Cobertura de media mesa, para completar entre dos jugadores o empezar por la mitad. Desglose de piezas pendiente de cierre.",
    icon: ["M28 112 h144 M28 112 V70 h60 v42 M96 112 V52 h48 v60"],
  },
  {
    slug: "ruined-buildings",
    name: "Ruined Buildings",
    megaLabel: "RUINAS EN L",
    category: "piezas",
    slotCost: "half",
    description: "8 piezas en L de ruinas altas y piezas bajas con el mismo footprint.",
    pieceCount: 8,
    icon: [
      "M32 116 h136 M32 116 V52 l40 -24 v64",
      "M72 92 h96 v24 M112 92 V44 l56 -20 v68",
    ],
  },
  {
    slug: "blockers-barricadas",
    name: "Blockers & Barricadas",
    megaLabel: "MEDIA ALTURA",
    category: "piezas",
    slotCost: "half",
    description: "Dispositivos de energía, acueducto alto y barricadas.",
    icon: ["M28 110 h144 M44 110 V78 h32 v32 M92 110 V66 h32 v44 M140 110 V86 h24 v24"],
  },
  {
    slug: "rubble-walls",
    name: "Rubble Walls",
    megaLabel: "COBERTURA BAJA",
    category: "piezas",
    slotCost: "half",
    description: "Muros bajos de escombros.",
    icon: ["M28 112 h144 M28 112 V84 h144 v28 M40 84 V68 h40 v16 M104 84 V60 h44 v24"],
  },
];
