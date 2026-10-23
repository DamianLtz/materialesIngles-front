import type { ColumnDef } from "@tanstack/react-table";
import { COLUMNA_ACCIONES } from "@/components/data-table/data-table";
import { formatearFecha } from "@/lib/formato";
import type { Escuela } from "./api";
import { AccionesEscuela } from "./acciones-escuela";

export const columnasEscuelas: ColumnDef<Escuela>[] = [
  { accessorKey: "nombre", header: "Nombre" },
  { accessorKey: "cueanexo", header: "CUE/Anexo" },
  { accessorKey: "distrito", header: "Distrito" },
  {
    id: "direccion",
    header: "Dirección",
    // altura 0 significa "sin número"
    cell: ({ row }) =>
      row.original.altura > 0
        ? `${row.original.calle} ${row.original.altura}`
        : row.original.calle,
  },
  { accessorKey: "codigoPostal", header: "C.P." },
  {
    accessorKey: "createdAt",
    header: "Alta",
    cell: ({ row }) => formatearFecha(row.original.createdAt),
  },
  {
    id: COLUMNA_ACCIONES,
    header: "Acciones",
    cell: ({ row }) => <AccionesEscuela escuela={row.original} />,
  },
];
