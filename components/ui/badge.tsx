import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-none font-mono text-[10.5px] tracking-[0.12em] uppercase",
  {
    variants: {
      variant: {
        "slot-full": "border border-slot-full-border px-[9px] py-[5px] text-slot-full",
        "slot-half": "border border-slot-half-border px-[9px] py-[5px] text-slot-half",
        solid: "bg-accent px-[9px] py-1 font-medium text-on-accent",
      },
    },
    defaultVariants: {
      variant: "slot-full",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
