import type { ColumnDef } from "@tanstack/react-table";
import { COLUMNA_ACCIONES } from "@/components/data-table/data-table";
import { AccionesEtapa } from "./acciones-etapa";
import type { Etapa } from "./api";
import { textoPeriodo } from "./formato";

const MAX_GRADOS_VISIBLES = 3;

/** Nombres de grado sin repetir ("1er Grado, 2do Grado y 2 más"). */
function textoGrados(etapa: Etapa): string {
  const nombres = [...new Set(etapa.ofertas.map((o) => o.gradoNombre))];
  if (!nombres.length) return "—";
  const visibles = nombres.slice(0, MAX_GRADOS_VISIBLES).join(", ");
  const resto = nombres.length - MAX_GRADOS_VISIBLES;
  return resto > 0 ? `${visibles} y ${resto} más` : visibles;
}

export const columnasEtapas: ColumnDef<Etapa>[] = [
  { accessorKey: "nombre", header: "Nombre" },
  {
    id: "seleccion",
    header: "Período de selección",
    cell: ({ row }) =>
      textoPeriodo(row.original.fechaInicio, row.original.fechaFin),
  },
  {
    id: "reclamo",
    header: "Período de reclamo",
    cell: ({ row }) =>
      textoPeriodo(row.original.reclamoInicio, row.original.reclamoFin),
  },
  {
    accessorKey: "visible",
    header: "Estado",
    cell: ({ row }) =>
      row.original.visible ? (
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          Publicada
        </span>
      ) : (
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          Oculta
        </span>
      ),
  },
  { accessorKey: "cantidadEscuelas", header: "Escuelas" },
  {
    id: "grados",
    header: "Grados",
    cell: ({ row }) => textoGrados(row.original),
  },
  {
    id: COLUMNA_ACCIONES,
    header: "Acciones",
    cell: ({ row }) => <AccionesEtapa etapa={row.original} />,
  },
];
