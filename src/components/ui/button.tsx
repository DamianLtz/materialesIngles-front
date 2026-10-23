import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const FOCO_Y_DISABLED_OBELISCO =
  "focus-visible:border-transparent focus-visible:ring-4 focus-visible:ring-cian-800 disabled:border-transparent disabled:bg-gray-100 disabled:text-grisulado-400 disabled:opacity-100";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        baseUI: "",
        obelisco: FOCO_Y_DISABLED_OBELISCO,
      },
      color: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",

        // --- A partir de acá, los 6 colores de @gcba/obelisco-v2 -----------
        primario: "bg-azul-800 text-white hover:bg-azul-950 font-semibold",
        secundario: "bg-azul-700 text-white hover:bg-azul-900 font-semibold",
        // Único color con texto oscuro sobre fondo sólido — no es un
        // descuido, así lo define Obelisco (styles.css:13452 aprox.).
        terciario: "bg-cian-500 text-azul-900 hover:bg-cian-600 font-semibold",
        // Éxito y Error no oscurecen en hover — a diferencia de los
        // demás colores, en Obelisco solo pierden el borde (que acá no
        // aplica: es la versión sólida). Se deja el mismo bg en hover.
        exito: "bg-verde-700 text-white hover:bg-verde-700 font-semibold",
        error: "bg-rojo-600 text-white hover:bg-rojo-600 font-semibold",
        // "Light": fondo blanco, texto oscuro — el más distinto de los 6.
        light: "bg-white text-azul-900 hover:bg-grisulado-100 font-semibold",
      },
      appearance: {
        solid: "",
        // Solo tiene efecto sobre los 6 `color` de Obelisco (ver
        // compoundVariants); en cualquier otro color no hace nada.
        outline: "",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        obelisco:
          "h-12 lg:h-11 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 rounded-full",
        baseUI:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 rounded-xl",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    // Modo outline de los 6 colores Obelisco: mismo color de texto que el
    // fondo sólido de arriba, borde del mismo color, sin fondo propio. En
    // hover pasa a fondo lleno + texto blanco (mismo bg que el hover
    // sólido de cada color) — así lo hace Obelisco, no una elección propia.
    // Se engancha solo con `color`, no con `variant`: el modo outline de
    // estos 6 colores es igual de válido combinado con variant="baseUI"
    // (chrome de shadcn) que con variant="obelisco" (chrome de Obelisco).
    compoundVariants: [
      {
        color: "primario",
        appearance: "outline",
        className:
          "border-azul-800 bg-transparent text-azul-800 hover:border-transparent hover:bg-azul-950 hover:text-white",
      },
      {
        color: "secundario",
        appearance: "outline",
        className:
          "border-azul-700 bg-transparent text-azul-700 hover:border-transparent hover:bg-azul-900 hover:text-white",
      },
      {
        color: "terciario",
        appearance: "outline",
        className:
          "border-cian-500 bg-transparent text-cian-500 hover:border-transparent hover:bg-cian-600 hover:text-white",
      },
      {
        color: "exito",
        appearance: "outline",
        className:
          "border-verde-700 bg-transparent text-verde-700 hover:border-transparent hover:bg-verde-700 hover:text-white",
      },
      {
        color: "error",
        appearance: "outline",
        className:
          "border-rojo-600 bg-transparent text-rojo-600 hover:border-transparent hover:bg-rojo-600 hover:text-white",
      },
      {
        // Único que invierte: outline blanco sobre fondo oscuro (así es
        // en Obelisco — "Light" siempre vive sobre superficies oscuras).
        color: "light",
        appearance: "outline",
        className:
          "border-white bg-azul-900 text-white hover:border-transparent hover:bg-grisulado-100 hover:text-azul-900",
      },
    ],
    defaultVariants: {
      variant: "obelisco",
      color: "primario",
      appearance: "solid",
      size: "obelisco",
    },
  },
);

function Button({
  className,
  variant = "obelisco",
  color = "primario",
  appearance = "solid",
  size = "obelisco",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({ variant, color, appearance, size, className }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
