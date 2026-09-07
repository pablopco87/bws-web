"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { packs } from "@/lib/data/packs";
import { navLinks } from "@/lib/site-config";

/**
 * Full-screen mobile menu — closed direction 16b (design/project/Responsive Mobile BWS.dc.html):
 * "Packs" is an accordion row expanding in place (no separate layer), chevron rotates 180°,
 * all five packs always listed, tap opens/closes.
 *
 * 16b's own badge is a binary LIBRE/EN COLA (availability), not the slot-cost badge desktop's
 * mega-menu uses — deliberately, per that file's own caption ("el detalle por variante vive en
 * la página de pack, así que en navegación cada variante lleva estado binario"). Pablo asked
 * explicitly to use the same slot-cost badge as desktop here instead, overriding that; see the
 * commit that changed this.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menú"
          className="flex size-9 items-center justify-center text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showClose={false}
        className="w-full border-l-0 p-0 sm:max-w-none"
      >
        <SheetTitle className="sr-only">Menú</SheetTitle>
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-divider px-[18px]">
          <Image
            src="/logos/bws-wordmark.svg"
            alt="Brutal Work Studio"
            width={110}
            height={20}
            className="bws-logo h-5 w-auto"
          />
          <SheetClose className="font-mono text-[10.5px] tracking-[0.12em] text-accent">
            CERRAR
          </SheetClose>
        </div>
        <nav className="flex flex-1 flex-col overflow-y-auto pt-2 pb-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="packs" className="border-b border-border-divider">
              <AccordionTrigger className="px-[18px] py-[18px] text-[19px] hover:no-underline">
                Packs
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="flex flex-col">
                  {packs.map((pack) => (
                    <Link
                      key={pack.slug}
                      href={`/packs/${pack.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex min-h-14 items-center justify-between gap-3 border-b border-[color:#16161b] py-[15px] pr-[18px] pl-[30px] text-[15.5px]"
                    >
                      <span>{pack.name}</span>
                      <Badge
                        variant={pack.slotCost === "full" ? "slot-full" : "slot-half"}
                        className="shrink-0"
                      >
                        {pack.slotCost === "full" ? "1 SLOT" : "1/2 SLOT"}
                      </Badge>
                    </Link>
                  ))}
                  <Link
                    href="/packs"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-[15px] pr-[18px] pl-[30px] font-mono text-[11px] tracking-[0.12em] text-accent"
                  >
                    VER LOS 5 PACKS
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border-divider px-[18px] py-[18px] text-[19px] font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
