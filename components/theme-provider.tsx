"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * BWS defaults to dark and only ever switches on an explicit user toggle
 * (no system-preference detection) — matches the .dc prototype's
 * `applyTheme(this.props.tema || "dark")` behavior.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "light"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
