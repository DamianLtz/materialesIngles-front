import type { ColumnDef } from "@tanstack/react-table";
import { COLUMNA_ACCIONES } from "@/components/data-table/data-table";
import { formatearFecha } from "@/lib/formato";
import type { Grado } from "./api";
import { AccionesGrado } from "./acciones-grado";

export const columnasGrados: ColumnDef<Grado>[] = [
  { accessorKey: "nombre", header: "Nombre" },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
    cell: ({ row }) => formatearFecha(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Fecha de actualización",
    cell: ({ row }) => formatearFecha(row.original.updatedAt),
  },
  {
    id: COLUMNA_ACCIONES,
    header: "Acciones",
    cell: ({ row }) => <AccionesGrado grado={row.original} />,
  },
];
