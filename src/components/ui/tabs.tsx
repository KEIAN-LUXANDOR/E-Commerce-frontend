"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center border border-[var(--color-line)] bg-white p-0.5 text-[var(--color-slate)] select-none",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-all",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-loupe)] disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-[var(--color-ink)] data-[state=active]:text-white",
      "data-[state=inactive]:text-[var(--color-slate)] data-[state=inactive]:hover:text-[var(--color-ink)] data-[state=inactive]:hover:bg-[var(--color-stone)]",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-loupe)]",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
