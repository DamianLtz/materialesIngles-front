"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
        /* Personalizado */
        primary:
          "border-input border bg-muted aria-pressed:border-transparent aria-pressed:bg-azul-700 aria-pressed:text-white data-[state=on]:border-transparent data-[state=on]:bg-azul-700 data-[state=on]:text-white hover:text-white hover:bg-azul-900 hover:border-transparent",
        secondary:
          "border-input border bg-muted aria-pressed:border-transparent aria-pressed:bg-azul-700 aria-pressed:text-white data-[state=on]:border-transparent data-[state=on]:bg-azul-700 data-[state=on]:text-white hover:text-white hover:bg-azul-700 hover:border-transparent",
        tertiary:
          "border-input border bg-muted aria-pressed:border-transparent aria-pressed:bg-cian-500 aria-pressed:azul-900 data-[state=on]:border-transparent data-[state=on]:bg-cian-500 data-[state=on]:azul-900 hover:text-azul-900 hover:bg-cian-500 hover:border-transparent",
        success:
          "border-input border bg-muted aria-pressed:border-transparent aria-pressed:bg-verde-700 aria-pressed:text-white data-[state=on]:border-transparent data-[state=on]:bg-verde-700 data-[state=on]:text-white hover:text-white hover:bg-verde-700 hover:border-transparent",
        warning:
          "border-input border bg-muted aria-pressed:border-transparent aria-pressed:bg-naranja-500 aria-pressed:text-white data-[state=on]:border-transparent data-[state=on]:bg-naranja-500 data-[state=on]:text-white hover:text-white hover:bg-naranja-500 hover:border-transparent",
        danger:
          "border-input border bg-muted aria-pressed:border-transparent aria-pressed:bg-rojo-600 aria-pressed:text-white data-[state=on]:border-transparent data-[state=on]:bg-rojo-600 data-[state=on]:text-white hover:text-white hover:bg-rojo-600 hover:border-transparent",
        ghost:
          "border-input border bg-muted aria-pressed:border-transparent aria-pressed:bg-gris-100 aria-pressed:text-azul-900 data-[state=on]:border-transparent data-[state=on]:bg-gris-100 data-[state=on]:text-azul-900 hover:text-azul-900 hover:bg-gris-100 hover:border-transparent",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
