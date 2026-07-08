import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 min-h-12 min-w-12 px-4",
  {
    variants: {
      variant: {
        default: "bg-accent text-bg hover:bg-accent/90",
        secondary: "bg-surface border border-line text-text hover:bg-line/30",
        ghost: "hover:bg-surface text-text-dim hover:text-text",
        flare: "bg-flare text-text hover:bg-flare/90",
        warn: "bg-warn text-bg hover:bg-warn/90",
      },
      size: {
        default: "h-12 px-4",
        sm: "h-10 px-3 text-xs",
        lg: "h-14 px-6",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
