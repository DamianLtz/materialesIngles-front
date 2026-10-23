import type { ColumnDef } from "@tanstack/react-table";
import { formatearFecha } from "@/lib/formato";
import type { ReclamoListado } from "./api";
import { CeldaEstado } from "./celda-estado";

export const columnasReclamos: ColumnDef<ReclamoListado>[] = [
  {
    id: "lote",
    header: "ID del lote",
    cell: ({ row }) => `#${row.original.pedidoId}`,
  },
  {
    id: "escuela",
    header: "Escuela",
    cell: ({ row }) => (
      <div>
        <div>{row.original.escuela.nombre}</div>
        <div className="text-xs text-muted-foreground">
          CUE/Anexo {row.original.escuela.cueanexo}
        </div>
      </div>
    ),
  },
  {
    id: "oferta",
    header: "Grado – Catálogo",
    cell: ({ row }) => `${row.original.grado} – ${row.original.catalogo}`,
  },
  {
    id: "libro",
    header: "Libro",
    cell: ({ row }) => (
      <div>
        <div>{row.original.libro.titulo}</div>
        <div className="text-xs text-muted-foreground">
          ISBN {row.original.libro.isbn}
        </div>
      </div>
    ),
  },
  { accessorKey: "tipo", header: "Tipo de reclamo" },
  {
    id: "cantidad",
    header: "Cantidad",
    cell: ({ row }) => row.original.cantidad ?? "—",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de reclamo",
    cell: ({ row }) => formatearFecha(row.original.createdAt),
  },
  {
    id: "estado",
    header: "Estado",
    cell: ({ row }) => <CeldaEstado reclamo={row.original} />,
  },
];
