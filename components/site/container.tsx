import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  /**
   * Renders as this tag instead of `div` at runtime. Not tag-specific at the type level (see
   * below for why) — nobody in this codebase uses it yet, but the render-as-anything escape
   * hatch stays available.
   */
  as?: React.ElementType;
  /**
   * "page" (default) — the 1440px canvas + 18px/56px gutters shared by every page and by
   * SiteHeader/SiteFooter/Breadcrumb. "content" — the narrower 1160px reading column nested
   * inside a "page" container (long-form text/accordion sections — see Foundations,
   * Sobre Nosotros, FAQ, Checkout in design/project/*.dc.html), no gutter of its own since it
   * relies on the "page" container it sits inside for that.
   */
  size?: "page" | "content";
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * The one place max-width and horizontal padding for page content are defined. Always keep
 * both on the SAME element here — splitting them across a padded wrapper + a separately
 * max-width'd child (as SiteFooter/Breadcrumb/FAQ used to) silently misaligns content on any
 * viewport wider than max-width + 2×padding, since the two nesting orders only produce the same
 * result below that width. See CLAUDE.md.
 *
 * `as` is intentionally typed as plain `React.ElementType` rather than a generic `T extends
 * React.ElementType` tied to `ComponentPropsWithoutRef<T>` — @react-three/fiber (Slider System's
 * hero) augments React's global `JSX.IntrinsicElements` with its full Three.js element set, and
 * that combined with this component's old per-tag generic broke type inference here even in
 * files that never touch Three.js. Nothing in the codebase passes tag-specific props through
 * `as` today, so this trades away prop types narrowed to whatever tag `as` happens to be for a
 * fix that isn't sensitive to whatever else gets merged into the global JSX namespace.
 */
export function Container({ as, size = "page", className, children, ...props }: ContainerProps) {
  // Same global-JSX-namespace issue as above: with @react-three/fiber's Three.js elements
  // merged into JSX.IntrinsicElements, some of them take no children at all, so TypeScript
  // computes `React.ElementType` used directly as a JSX tag as accepting `children: never`.
  // `div` is always the real default in practice; this cast just stops that merged type from
  // leaking into this component's own children prop.
  const Comp = (as || "div") as React.ElementType<React.HTMLAttributes<HTMLElement>>;

  return (
    <Comp
      className={cn(
        "mx-auto w-full",
        size === "page" ? "max-w-[1440px] px-[18px] lg:px-14" : "max-w-[1160px]",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
