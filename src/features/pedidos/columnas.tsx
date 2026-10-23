import type { ColumnDef } from "@tanstack/react-table";
import { COLUMNA_ACCIONES } from "@/components/data-table/data-table";
import { formatearFecha } from "@/lib/formato";
import type { PedidoListado } from "./api";
import { AccionesPedido } from "./acciones-pedido";

export const columnasPedidos: ColumnDef<PedidoListado>[] = [
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
        <div>
          {row.original.libro.titulo}
          {row.original.libro.borrado && (
            <span className="ml-1 text-xs text-muted-foreground">
              (deshabilitado)
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          ISBN {row.original.libro.isbn}
        </div>
      </div>
    ),
  },
  { accessorKey: "cantidad", header: "Cantidad" },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => formatearFecha(row.original.createdAt),
  },
  {
    id: COLUMNA_ACCIONES,
    header: "Acciones",
    cell: ({ row }) => <AccionesPedido pedido={row.original} />,
  },
];
