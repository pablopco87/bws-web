"use client";

import * as React from "react";
import Link from "next/link";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { faqItems } from "@/lib/data/faq";
import { cn } from "@/lib/utils";

/**
 * `.bwsacc` from design/project/FAQ BWS.dc.html (same pattern as Inicio's refuerzo module,
 * never ported to code before this page): index column + big heading + "+" mark that rotates
 * 45° to "×", single item open at a time. Built directly on radix-ui's Accordion rather than
 * components/ui/accordion.tsx — that primitive already has a different visual contract
 * (chevron, no index column) wired into MobileNav's Packs row; reusing it here would mean
 * either forking its styling per-caller or risking MobileNav's behavior.
 */
export function FaqAccordion() {
  const [value, setValue] = React.useState(faqItems[0]?.index);

  return (
    <AccordionPrimitive.Root type="single" collapsible value={value} onValueChange={setValue}>
      {faqItems.map((item, i) => (
        <AccordionPrimitive.Item
          key={item.index}
          value={item.index}
          className={cn(
            "border-t border-border-hairline px-1 pt-[26px] pb-[26px] transition-colors duration-[250ms] hover:bg-accent/[0.05]",
            i === faqItems.length - 1 && "border-b"
          )}
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-baseline gap-3 border-0 bg-transparent p-0 text-left outline-none lg:gap-5">
              <span className="w-14 shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted-2 transition-colors duration-[250ms] group-hover:text-accent group-data-[state=open]:text-accent lg:w-[118px]">
                {item.index}
              </span>
              <span className="flex-1 text-[27px] leading-[1.15] font-medium tracking-[-0.015em] text-muted-2 transition-colors duration-[250ms] group-hover:text-foreground group-data-[state=open]:text-foreground">
                {item.question}
              </span>
              <span className="font-mono text-[17px] text-muted-3 transition-[transform,color] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=open]:rotate-45 group-data-[state=open]:text-accent">
                +
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="max-w-[760px] pt-3.5 pl-[68px] text-[15.5px] leading-[1.55] text-muted lg:pl-[138px]">
              {item.answer}
              {item.index === "P·07" && (
                <>
                  {" "}
                  (ver{" "}
                  <button
                    type="button"
                    onClick={() => setValue("P·08")}
                    className="inline-flex items-center gap-[7px] border-b border-accent/32 text-accent transition-colors duration-200 hover:border-link-hover hover:text-link-hover"
                  >
                    P·08
                  </button>
                  ).
                </>
              )}
              {item.index === "P·11" && (
                <div className="mt-3">
                  <Link
                    href="/legal/licencia-de-uso"
                    className="group inline-flex items-center gap-[7px] border-b border-accent/32 text-accent transition-colors duration-200 hover:border-link-hover hover:text-link-hover"
                  >
                    Ver la licencia de uso
                    <span className="font-mono transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
