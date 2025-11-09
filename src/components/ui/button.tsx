import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
   "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "text-white font-semibold shadow-lg hover:shadow-xl",
        destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25 border border-red-500/20",
        outline: "border bg-transparent text-white hover:shadow-md backdrop-blur-md",
        secondary: "text-white hover:shadow-md",
        ghost: "hover:bg-white/10 hover:text-white hover:shadow-sm text-gray-300",
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Custom styling based on variant
    const getVariantStyles = (variant?: string) => {
      const baseStyle = {
        borderRadius: 'var(--radius-lg)',
      };
      
      switch (variant) {
        case 'default':
          return {
            ...baseStyle,
            background: 'var(--gradient-primary)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            boxShadow: 'var(--shadow-glow)',
          };
        case 'outline':
          return {
            ...baseStyle,
            background: 'transparent',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          };
        case 'secondary':
          return {
            ...baseStyle,
            background: 'var(--gradient-secondary)',
            border: '1px solid rgba(74, 172, 254, 0.3)',
            boxShadow: '0 0 20px rgba(74, 172, 254, 0.3)',
          };
        case 'ghost':
          return {
            ...baseStyle,
            background: 'transparent',
            border: 'none',
          };
        default:
          return baseStyle;
      }
    };
    
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }))} 
        style={getVariantStyles(variant)}
        ref={ref} 
        {...props} 
        onMouseEnter={(e) => {
          if (variant === 'outline') {
            e.currentTarget.style.background = 'var(--color-dark-hover)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          } else if (variant === 'default') {
            e.currentTarget.style.boxShadow = '0 0 40px rgba(102, 126, 234, 0.6), var(--shadow-lg)';
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (variant === 'outline') {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          } else if (variant === 'default') {
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          }
          props.onMouseLeave?.(e);
        }}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
