import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
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
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * The one place max-width and horizontal padding for page content are defined. Always keep
 * both on the SAME element here — splitting them across a padded wrapper + a separately
 * max-width'd child (as SiteFooter/Breadcrumb/FAQ used to) silently misaligns content on any
 * viewport wider than max-width + 2×padding, since the two nesting orders only produce the same
 * result below that width. See CLAUDE.md.
 */
export function Container<T extends React.ElementType = "div">({
  as,
  size = "page",
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Comp = as || "div";

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
