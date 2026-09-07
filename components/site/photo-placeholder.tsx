import { cn } from "@/lib/utils";

/**
 * `.bwsph` — the dashed diagonal-stripe media placeholder used across pages wherever real
 * photography/renders are still pending (design/project/*.dc.html: Home, Foundations' pack
 * card example, Sobre Nosotros). `label` defaults to the photography wording; pass
 * "RENDER PENDIENTE" for 3D/product-render contexts.
 */
export function PhotoPlaceholder({
  aspect,
  caption,
  label = "FOTOGRAFÍA PENDIENTE",
  className,
}: {
  aspect: string;
  caption: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 border border-dashed border-placeholder-border bg-[repeating-linear-gradient(135deg,var(--color-placeholder-stripe-a)_0_8px,var(--color-placeholder-stripe-b)_8px_16px)] px-6 text-center",
        className
      )}
      style={{ aspectRatio: aspect }}
    >
      <div className="font-mono text-[11.5px] tracking-[0.16em] text-accent">{label}</div>
      <div className="max-w-[78%] font-mono text-[10.5px] leading-[1.7] tracking-[0.1em] text-muted-3">
        {caption}
      </div>
    </div>
  );
}
