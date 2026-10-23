import type { ColumnDef } from "@tanstack/react-table";
import { COLUMNA_ACCIONES } from "@/components/data-table/data-table";
import type { Libro } from "./api";
import { AccionesLibro } from "./acciones-libro";

export const columnasLibros: ColumnDef<Libro>[] = [
  {
    accessorKey: "isbn",
    header: "ISBN",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.isbn}</span>
    ),
  },
  { accessorKey: "titulo", header: "Título" },
  { accessorKey: "editorial", header: "Editorial" },
  {
    id: "grado",
    header: "Grado",
    cell: ({ row }) => row.original.grado.nombre,
  },
  {
    id: COLUMNA_ACCIONES,
    header: "Acciones",
    cell: ({ row }) => <AccionesLibro libro={row.original} />,
  },
];
