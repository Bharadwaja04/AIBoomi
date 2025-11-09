import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    const inputStyle = {
      background: 'var(--color-dark-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      color: 'var(--color-text-primary)',
      backdropFilter: 'blur(10px)',
      transition: 'all var(--transition-base)',
      ...(isFocused && {
        borderColor: 'var(--color-primary)',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1), var(--shadow-glow)',
        transform: 'translateY(-2px)',
      }),
    };
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full px-4 py-3 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        style={inputStyle}
        ref={ref}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
