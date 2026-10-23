import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Mismos 6 nombres de `color` que usa Button para variant="obelisco" (ver
// button.tsx) — acá en versión suave (bg-100/text-700+), no sólida, que es
// como se ven los badges de estado en vez de botones de acción. "rosa" es
// un séptimo color, fuera de la paleta oficial de Obelisco: es el rose de
// Tailwind tomado tal cual (--color-rosa-* en index.css), para cuando hace
// falta un color más y ninguno de los 6 sirve (ver ROL_BADGE en
// usuarios/columns.tsx, el primer uso).
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      color: {
        primario: "bg-azul-100 text-azul-900",
        secundario: "bg-azul-50 text-azul-700",
        terciario: "bg-cian-100 text-cian-700",
        exito: "bg-verde-50 text-verde-700",
        error: "bg-rojo-100 text-rojo-700",
        // Amarillo de Obelisco: avisos que piden atención sin ser un error
        // (turno "a reprogramar", turno asignado por excepción).
        advertencia: "bg-amarillo-100 text-amarillo-700",
        light: "bg-grisulado-100 text-grisulado-700",
        rosa: "bg-rosa-100 text-rosa-700",
        violeta: "bg-violeta-100 text-violeta-700",
      },
    },
    defaultVariants: {
      color: "primario",
    },
  },
);

export type BadgeColor = NonNullable<
  VariantProps<typeof badgeVariants>["color"]
>;

function Badge({
  className,
  color,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ color, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
