import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium transition-[background,color,border-color,box-shadow,transform] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-[0.38]",
  {
    variants: {
      variant: {
        primary:
          "border border-accent text-accent hover:-translate-y-0.5 hover:border-accent-hover hover:bg-accent-hover hover:text-on-accent hover:shadow-[0_10px_28px_rgba(74,222,128,0.18)]",
        secondary:
          "border border-border text-foreground hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:bg-accent/[0.07]",
        solid:
          "border border-accent bg-accent font-semibold text-on-accent hover:border-accent-hover hover:bg-accent-hover",
        link: "h-auto gap-[7px] rounded-none border-b border-accent/32 px-0 py-0.5 font-normal text-accent hover:border-link-hover hover:text-link-hover",
      },
      size: {
        default: "h-[52px] px-[26px] text-[15px]",
        sm: "h-12 px-5 text-sm",
        icon: "h-[52px] w-[52px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
