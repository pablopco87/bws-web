"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Wraps a horizontally-scrolling row (`overflow-x-auto`) with click-and-drag scrolling for mouse
 * users — plain CSS overflow only scrolls sideways via a horizontal-scroll mouse wheel/trackpad
 * gesture, which most mice don't have. Touch keeps its native panning (only mouse/pen pointers
 * drive the manual scrollLeft drag) — same pointer-capture pattern as compare-slider.tsx.
 */
export function DraggableScrollRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-x-auto",
        dragging ? "cursor-grabbing select-none" : "cursor-grab",
        className
      )}
      style={{ touchAction: "pan-x" }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        const el = ref.current;
        if (!el) return;
        drag.current = { startX: e.clientX, startScroll: el.scrollLeft, moved: false };
        el.setPointerCapture(e.pointerId);
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        const el = ref.current;
        if (!el) return;
        const dx = e.clientX - drag.current.startX;
        if (Math.abs(dx) > 3) drag.current.moved = true;
        el.scrollLeft = drag.current.startScroll - dx;
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onClickCapture={(e) => {
        // A real drag shouldn't also fire a click on whatever's under the pointer on release.
        if (drag.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = false;
        }
      }}
    >
      {children}
    </div>
  );
}
