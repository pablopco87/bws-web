"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ShoppingBag } from "lucide-react";

import { Container } from "@/components/site/container";
import { PacksMegaMenu } from "@/components/site/packs-mega-menu";
import { MobileNav } from "@/components/site/mobile-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { navLinks } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Root layout component present on every page (design/project/Foundations BWS.dc.html §04).
 * Desktop ≥1024px: full nav with the Packs mega-menu (direction 9b, chat3/chat4). Below that:
 * hamburger → MobileNav's full-screen sheet with Packs as an accordion (16b).
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border-divider bg-background/85 backdrop-blur-sm">
      <Container className="relative flex h-[84px] items-center justify-between">
        <Link href="/" aria-label="Brutal Work Studio · inicio" className="shrink-0">
          <Image
            src="/logos/bws-wordmark.svg"
            alt="Brutal Work Studio"
            width={140}
            height={30}
            priority
            className="bws-logo h-[26px] w-auto lg:h-[30px]"
          />
        </Link>

        <div className="hidden items-center gap-[34px] text-sm text-muted lg:flex">
          <div className="group">
            <button
              type="button"
              aria-haspopup="true"
              className="flex items-center gap-[7px] text-sm text-muted outline-none transition-colors duration-[180ms] group-hover:text-accent group-focus-within:text-accent"
            >
              Packs
              <ChevronDown className="size-[9px] transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div
              // Clicking a link inside navigates client-side, and SiteHeader isn't remounted by
              // that navigation — so without this, the link keeps focus after the route change
              // and group-focus-within (needed for keyboard users tabbing through the menu)
              // keeps the panel open until an unrelated click steals focus away.
              onClick={() => (document.activeElement as HTMLElement | null)?.blur?.()}
              className="invisible absolute inset-x-[18px] top-full pt-3.5 opacity-0 transition-[opacity,visibility,transform] duration-200 [transform:translateY(-6px)] group-hover:visible group-hover:opacity-100 group-hover:[transform:translateY(0)] group-focus-within:visible group-focus-within:opacity-100 group-focus-within:[transform:translateY(0)] lg:inset-x-14"
            >
              <PacksMegaMenu />
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors duration-[180ms] hover:text-accent",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-5 w-px bg-border-divider" aria-hidden="true" />

          <Link
            href="/carrito"
            className="flex items-center gap-2 text-foreground transition-colors duration-[180ms] hover:text-accent"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.6} />
            <span className="font-mono text-xs text-accent">0</span>
          </Link>

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/carrito" aria-label="Carrito" className="flex items-center gap-1.5">
            <ShoppingBag className="size-[18px]" strokeWidth={1.6} />
            <span className="font-mono text-xs text-accent">0</span>
          </Link>
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
