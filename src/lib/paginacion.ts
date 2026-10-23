import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { api } from "./api";

/** Respuesta paginada del back; reemplaza al paginador de Laravel del original. */
export interface Paginado<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

/** Parámetros de listado que viajan en la URL de cada pantalla (?page=&perPage=&search=). */
export interface ParametrosListado {
  page?: number;
  perPage?: number;
  search?: string;
}

export const FILAS_POR_PAGINA = [5, 10, 15, 20] as const;
// Tiene que coincidir con el perPage por defecto del back (ListadoQueryDto)
export const FILAS_POR_DEFECTO = 5;

/**
 * `validateSearch` de las rutas con listado. Descarta lo inválido y no agrega
 * valores por defecto, así la URL queda limpia (`/back/grados` sin `?page=1`).
 */
export function validarListado(
  search: Record<string, unknown>,
): ParametrosListado {
  const page = Number(search.page);
  const perPage = Number(search.perPage);
  // El router interpreta la URL como JSON: ?search=9780194118415 llega como número
  // (un ISBN), no como texto, y habría que descartarlo sin esta conversión
  const bruto = search.search;
  const texto =
    typeof bruto === "string" || typeof bruto === "number"
      ? String(bruto).trim()
      : "";

  return {
    page: Number.isInteger(page) && page > 1 ? page : undefined,
    perPage: (FILAS_POR_PAGINA as readonly number[]).includes(perPage)
      ? perPage
      : undefined,
    search: texto || undefined,
  };
}

/** Arma `?page=2&search=ab` salteando lo que no está definido. */
export function armarQuery(params: ParametrosListado): string {
  const query = new URLSearchParams();
  for (const [clave, valor] of Object.entries(params)) {
    if (valor !== undefined && valor !== "") query.set(clave, String(valor));
  }
  const texto = query.toString();
  return texto ? `?${texto}` : "";
}

/**
 * Query de un listado paginado. Mientras carga otra página se siguen mostrando los
 * datos anteriores (isPlaceholderData), sin que la tabla parpadee.
 */
export function queryListado<T>(
  // Clave simple ("grados") o compuesta (["libros", catalogoId]) si el listado
  // depende de otro dato; el primer elemento sirve para invalidar todo el recurso
  recurso: string | readonly [string, ...unknown[]],
  ruta: string,
  params: ParametrosListado,
) {
  const base = typeof recurso === "string" ? [recurso] : recurso;
  return queryOptions({
    queryKey: [...base, "listado", params],
    queryFn: () => api<Paginado<T>>(`${ruta}${armarQuery(params)}`),
    placeholderData: keepPreviousData,
  });
}
