import type { ColumnDef } from "@tanstack/react-table";
import { COLUMNA_ACCIONES } from "@/components/data-table/data-table";
import type { TipoReclamo } from "./api";
import { AccionesTipoReclamo } from "./acciones-tipo-reclamo";

export const columnasTiposReclamo: ColumnDef<TipoReclamo>[] = [
  { accessorKey: "nombre", header: "Nombre" },
  {
    accessorKey: "leyenda",
    header: "Leyenda",
    cell: ({ row }) => {
      const { leyenda } = row.original;
      // Las leyendas son largas: se cortan en una línea y el texto completo queda en el tooltip
      return (
        <span
          className="block max-w-lg truncate text-muted-foreground"
          title={leyenda ?? undefined}
        >
          {leyenda ?? "—"}
        </span>
      );
    },
  },
  {
    id: COLUMNA_ACCIONES,
    header: "Acciones",
    cell: ({ row }) => <AccionesTipoReclamo tipo={row.original} />,
  },
];
