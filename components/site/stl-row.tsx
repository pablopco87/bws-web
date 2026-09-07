import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import type { Pack } from "@/lib/data/packs";

/**
 * Catalog row for one STL variant — design/project/STL BWS.dc.html (turno 8, artboard 8a,
 * ".bwspack" wide-row block). Unlike PackCard (Packs distributor), this has no "Ver ficha" link:
 * STL never got its own per-variant detail page in the design, only this row with independent
 * buy. "Comprar" has no href/handler yet — will eventually deep-link to Cults3D/MyMiniFactory,
 * hence the external-link arrow already baked into the button per chat6.md:153.
 */
export function StlRow({ pack }: { pack: Pack }) {
  return (
    <div className="flex flex-col gap-6 border border-border-hairline p-6 transition-[border-color,background] duration-[250ms] hover:border-accent hover:bg-surface-card-hover lg:grid lg:grid-cols-[180px_minmax(0,1fr)_240px_auto] lg:items-center lg:gap-7 lg:p-7">
      <PhotoPlaceholder aspect="4/3" label="RENDER PENDIENTE" caption={pack.name.toUpperCase()} />

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xl font-semibold tracking-[-0.02em]">{pack.name}</div>
          <span className="border border-accent/34 px-1.5 py-1 font-mono text-[9.5px] tracking-[0.14em] text-accent">
            ARCHIVO DIGITAL
          </span>
        </div>
        <p className="mt-2 text-[15px] leading-[1.6] text-muted">{pack.description}</p>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-muted">
        <SpecField label="PIEZAS" value="[XX]" />
        <SpecField label="STL" value="[XX]" />
        <SpecField label="VOL." value="[XXX] cm³" />
        <SpecField label="TIEMPO" value="[XX] h" />
      </div>

      <div className="flex items-center gap-4 lg:justify-end">
        <span className="font-mono text-lg text-accent">[XX,XX €]</span>
        <Button variant="primary" size="sm" asChild>
          <a href="#">
            Comprar
            <ArrowUpRight className="size-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function SpecField({ label, value }: { label: string; value: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-muted-3">{label}</span> {value}
    </span>
  );
}
