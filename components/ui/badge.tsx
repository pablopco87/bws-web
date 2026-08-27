import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-none font-mono text-[10.5px] tracking-[0.12em] uppercase",
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
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
