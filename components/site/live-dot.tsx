import { cn } from "@/lib/utils";

/** The pulsing accent dot used next to "FABRICACIÓN EN VIVO" and live status labels. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      className={cn("size-[6px] shrink-0 rounded-full bg-accent animate-blink", className)}
    />
  );
}
