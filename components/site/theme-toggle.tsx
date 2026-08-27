"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

/** .bwstoggle — 58×28 pill, sun/moon icons that swap contrast as the knob passes over them. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Standard next-themes hydration guard: server and first client render must match (both
  // "not mounted yet"), then flip once mounted to read the real theme.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  return (
    <SwitchPrimitive.Root
      checked={isLight}
      onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
      aria-label="Cambiar tema"
      className={cn(
        "relative inline-flex h-7 w-[58px] shrink-0 items-center rounded-full border border-border bg-transparent p-0 transition-colors hover:border-accent",
        className
      )}
    >
      <MoonIcon
        className={cn(
          "relative z-10 ml-[6.5px] size-[13px] shrink-0 transition-[color,opacity] duration-300",
          isLight ? "text-muted-3 opacity-80" : "text-on-accent opacity-100"
        )}
      />
      <SunIcon
        className={cn(
          "relative z-10 ml-[15px] size-[13px] shrink-0 transition-[color,opacity] duration-300",
          isLight ? "text-background opacity-100" : "text-muted-2 opacity-80"
        )}
      />
      <SwitchPrimitive.Thumb
        className={cn(
          "absolute top-0.5 left-0.5 size-[22px] rounded-full bg-accent transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isLight && "translate-x-[30px]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4M2 12h2M20 12h2" />
    </svg>
  );
}
