import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { FILAS_POR_DEFECTO } from "@/lib/paginacion";
import { DataTable } from "./data-table";

interface Props<T extends { id: number | string }> {
  columnas: ColumnDef<T>[];
  /** Todas las filas (ya filtradas): la tabla las pagina en el navegador. */
  filas: T[];
  /** Identifica los filtros aplicados: al cambiar, la tabla vuelve a la primera página. */
  filtros?: string;
}

/**
 * Tabla que pagina en el navegador, para datos que todavía no están guardados (ej. la vista
 * previa de un Excel). Es la misma `DataTable` del resto, sin pedir las páginas al servidor.
 */
export function DataTableCliente<T extends { id: number | string }>({
  columnas,
  filas,
  filtros = "",
}: Props<T>) {
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState<number>(FILAS_POR_DEFECTO);
  const [filtrosAnteriores, setFiltrosAnteriores] = useState(filtros);
  if (filtros !== filtrosAnteriores) {
    // Otro filtro es otra lista: la página anterior ya no tiene sentido
    setFiltrosAnteriores(filtros);
    setPagina(1);
  }

  const ultima = Math.max(1, Math.ceil(filas.length / porPagina));
  // Si al filtrar quedan menos páginas, se muestra la última en vez de una vacía
  const actual = Math.min(pagina, ultima);

  return (
    <DataTable
      columnas={columnas}
      datos={{
        data: filas.slice((actual - 1) * porPagina, actual * porPagina),
        meta: {
          page: actual,
          perPage: porPagina,
          total: filas.length,
          lastPage: ultima,
        },
      }}
      onPagina={setPagina}
      onFilas={(n) => {
        setPorPagina(n);
        setPagina(1);
      }}
    />
  );
}
