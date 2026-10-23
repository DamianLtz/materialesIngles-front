import { useNavigate, useSearch } from "@tanstack/react-router";
import type { ParametrosListado } from "@/lib/paginacion";

/**
 * Estado de un listado (página, filas por página y búsqueda), guardado en la URL.
 * Se usa dentro de una ruta cuyo `validateSearch` sea `validarListado`.
 */
export function useListado() {
  const navigate = useNavigate();
  const params: ParametrosListado = useSearch({ strict: false });

  function cambiar(cambios: ParametrosListado) {
    void navigate({
      to: ".",
      // Conserva los parámetros de la ruta (ej. $catalogoId)
      params: true,
      search: (prev: ParametrosListado) => ({ ...prev, ...cambios }),
      replace: true,
    });
  }

  return {
    params,
    irAPagina: (page: number) => cambiar({ page: page > 1 ? page : undefined }),
    // Al cambiar el tamaño o la búsqueda la página anterior deja de tener sentido
    cambiarFilas: (perPage: number) => cambiar({ perPage, page: undefined }),
    buscar: (search: string) =>
      cambiar({ search: search.trim() || undefined, page: undefined }),
  };
}
