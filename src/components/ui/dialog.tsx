import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import MacTrafficLights from "@/components/MacTrafficLights";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/70 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideChrome?: boolean;
    contentClassName?: string;
    spotlight?: boolean;
  }
>(({ className, children, hideChrome, contentClassName, spotlight, ...props }, ref) => {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  return (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        spotlight
          ? "mac-window fixed left-[50%] top-[14%] z-50 grid w-full max-w-xl translate-x-[-50%] gap-0 border border-border/40 bg-background/80 backdrop-blur-2xl shadow-2xl duration-150 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-hidden rounded-2xl"
          : "mac-window fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-3 border bg-background/95 shadow-lg duration-150 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-hidden sm:rounded-2xl",
        className,
      )}
      {...props}
    >
      {!hideChrome && !spotlight && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border/40 bg-gradient-to-b from-background/80 to-background/40">
          <MacTrafficLights onClose={() => closeRef.current?.click()} />
          <DialogPrimitive.Close ref={closeRef} className="sr-only" aria-hidden tabIndex={-1} />
          <span className="w-[42px]" />
        </div>
      )}
      <div className={cn(!hideChrome ? "p-6 pt-4" : "", contentClassName)}>{children}</div>
    </DialogPrimitive.Content>
  </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
