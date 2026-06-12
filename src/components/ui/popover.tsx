import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import MacTrafficLights from "@/components/MacTrafficLights";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    hideChrome?: boolean;
    contentClassName?: string;
  }
>(({ className, contentClassName, hideChrome, align = "center", sideOffset = 4, children, ...props }, ref) => {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "mac-window z-50 w-72 rounded-xl border border-border/40 bg-popover/95 backdrop-blur-xl text-popover-foreground shadow-xl outline-none overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      >
        {!hideChrome && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/40 bg-gradient-to-b from-background/80 to-background/30">
            <MacTrafficLights size="sm" onClose={() => closeRef.current?.click()} />
            <PopoverPrimitive.Close ref={closeRef} className="sr-only" aria-hidden tabIndex={-1} />
          </div>
        )}
        <div className={cn(hideChrome ? "p-4" : "p-3", contentClassName)}>{children}</div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
