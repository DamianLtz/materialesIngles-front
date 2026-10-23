import type { ColumnDef } from "@tanstack/react-table";
import { COLUMNA_ACCIONES } from "@/components/data-table/data-table";
import { formatearFecha } from "@/lib/formato";
import { etiquetaRol, type Usuario } from "./api";
import { AccionesUsuario } from "./acciones-usuario";

export const columnasUsuarios: ColumnDef<Usuario>[] = [
  { accessorKey: "nombre", header: "Nombre" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => etiquetaRol(row.original.rol),
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) =>
      row.original.activo ? (
        "Activo"
      ) : (
        <span className="text-muted-foreground">Sin acceso</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de alta",
    cell: ({ row }) => formatearFecha(row.original.createdAt),
  },
  {
    id: COLUMNA_ACCIONES,
    header: "Acciones",
    cell: ({ row }) => <AccionesUsuario usuario={row.original} />,
  },
];
