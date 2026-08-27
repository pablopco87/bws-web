"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-7 w-[58px] shrink-0 items-center rounded-full border border-border bg-transparent outline-none transition-colors hover:border-accent focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function SwitchThumb({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Thumb>) {
  return (
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block size-[22px] translate-x-0.5 rounded-full bg-accent shadow transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:translate-x-[30px]",
        className
      )}
      {...props}
    />
  )
}

export { Switch, SwitchThumb }
