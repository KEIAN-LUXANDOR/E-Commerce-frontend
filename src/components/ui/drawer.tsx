"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;
export const DrawerPortal = DialogPrimitive.Portal;

export const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[var(--color-ink)]/40 backdrop-blur-xs transition-opacity duration-300",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "right" | "left" | "bottom";
}

export const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, side = "right", ...props }, ref) => {
  // Guard clauses for slide-in positions without nested ternaries
  let positionStyles = "inset-y-0 right-0 h-full w-full max-w-md border-l";
  let animationStyles = "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right";

  if (side === "left") {
    positionStyles = "inset-y-0 left-0 h-full w-full max-w-md border-r";
    animationStyles = "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left";
  } else if (side === "bottom") {
    positionStyles = "inset-x-0 bottom-0 max-h-[85vh] w-full border-t";
    animationStyles = "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom";
  }

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-white border-[var(--color-line)] shadow-2xl transition ease-in-out duration-300",
          positionStyles,
          animationStyles,
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 p-1.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-[var(--color-loupe)] text-[var(--color-ink)]">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

export function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5",
        className
      )}
      {...props}
    />
  );
}
DrawerHeader.displayName = "DrawerHeader";

export function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-t border-[var(--color-line)] bg-[var(--color-stone)] px-6 py-4",
        className
      )}
      {...props}
    />
  );
}
DrawerFooter.displayName = "DrawerFooter";

export const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-serif text-lg font-normal tracking-tight text-[var(--color-ink)]",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;
