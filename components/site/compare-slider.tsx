"use client";

import { useRef, useState } from "react";

import { PhotoPlaceholder } from "@/components/site/photo-placeholder";

/**
 * Drag-to-compare pair — design/project/Slider System BWS.dc.html §04 (#bws-cmp / #bws-cmp-top /
 * #bws-cmp-bar). Pure clip-path over two stacked layers, no 3D involved.
 */
export function CompareSlider({
  beforeLabel,
  beforeCaption,
  afterLabel,
  afterCaption,
}: {
  beforeLabel: string;
  beforeCaption: string;
  afterLabel: string;
  afterCaption: string;
}) {
  const [percent, setPercent] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const setFromClientX = (clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.max(2, Math.min(98, p)));
  };

  return (
    <div
      ref={boxRef}
      className="relative aspect-3/2 cursor-ew-resize touch-none overflow-hidden border border-border-hairline select-none"
      onPointerDown={(e) => {
        draggingRef.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) setFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
      }}
    >
      <div className="absolute inset-0">
        <PhotoPlaceholder aspect="3/2" className="h-full border-0" label={afterLabel} caption={afterCaption} />
      </div>
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <PhotoPlaceholder aspect="3/2" className="h-full border-0" label={beforeLabel} caption={beforeCaption} />
      </div>
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-px bg-accent"
        style={{ left: `${percent}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex size-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-background/90 font-mono text-[13px] text-accent">
          ↔
        </div>
      </div>
      <div className="pointer-events-none absolute top-3.5 left-4 font-mono text-[10.5px] tracking-[0.12em] text-muted-3">
        PLANO GW
      </div>
      <div className="pointer-events-none absolute top-3.5 right-4 font-mono text-[10.5px] tracking-[0.12em] text-accent">
        MONTADO CON BWS
      </div>
    </div>
  );
}
