import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type TableMeta,
} from "@tanstack/react-table";
import { Loader2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Paginado } from "@/lib/paginacion";
import { DataTablePagination } from "./data-table-pagination";

/** Id de la columna de botones: queda fija a la derecha al hacer scroll horizontal. */
export const COLUMNA_ACCIONES = "acciones";

interface Props<T extends { id: number | string }> {
  columnas: ColumnDef<T>[];
  /** Si falta (primera carga) se muestra la tabla vacía. */
  datos?: Paginado<T>;
  /** Hay un pedido en curso: se muestra encima de los datos actuales. */
  cargando?: boolean;
  onPagina: (page: number) => void;
  onFilas: (perPage: number) => void;
  /** Acciones de la fila (editar, borrar) disponibles para las columnas via `table.options.meta`. */
  meta?: TableMeta<T>;
}

export function DataTable<T extends { id: number | string }>({
  columnas,
  datos,
  cargando = false,
  onPagina,
  onFilas,
  meta,
}: Props<T>) {
  // react-table v8 devuelve funciones que el React Compiler no puede memoizar
  "use no memo";

  const table = useReactTable({
    data: datos?.data ?? [],
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (fila) => String(fila.id),
    meta,
  });

  return (
    <div className="relative space-y-3">
      {cargando && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-md bg-background/60">
          <Loader2Icon
            className="size-6 animate-spin text-muted-foreground"
            aria-label="Cargando"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((grupo) => (
              <TableRow key={grupo.id}>
                {grupo.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-6 py-3",
                      header.column.id === COLUMNA_ACCIONES &&
                        "sticky right-0 z-10 bg-background",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((fila) => (
                <TableRow key={fila.id} className="group">
                  {fila.getVisibleCells().map((celda) => (
                    <TableCell
                      key={celda.id}
                      className={cn(
                        "px-6 py-3",
                        celda.column.id === COLUMNA_ACCIONES &&
                          "sticky right-0 bg-background shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] group-hover:bg-cielo-50 group-has-aria-expanded:bg-cielo-50",
                      )}
                    >
                      {flexRender(
                        celda.column.columnDef.cell,
                        celda.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnas.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {datos ? "No hay resultados." : "Cargando..."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {datos && (
        <DataTablePagination
          meta={datos.meta}
          onPagina={onPagina}
          onFilas={onFilas}
        />
      )}
    </div>
  );
}
