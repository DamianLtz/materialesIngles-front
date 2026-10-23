import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  armarQuery,
  type Paginado,
  type ParametrosListado,
} from "@/lib/paginacion";

export interface PedidoListado {
  id: number;
  escuela: { id: number; nombre: string; cueanexo: string };
  grado: string;
  catalogo: string;
  libro: { titulo: string; isbn: string; borrado: boolean };
  cantidad: number;
  createdAt: string;
}

/** El listado devuelve además la etapa que resolvió (la publicada si no se pide otra). */
export interface PedidosPaginados extends Paginado<PedidoListado> {
  etapaId: number | null;
}

export interface ParametrosPedidos extends ParametrosListado {
  etapaId?: number;
}

export interface EtapaFiltro {
  id: number;
  nombre: string;
  visible: boolean;
}

export interface LibroAsignado {
  id: number;
  titulo: string;
  isbn: string;
  editorial: string;
  /** El libro fue deshabilitado en el catálogo: sigue asignado pero no se puede elegir de nuevo. */
  borrado: boolean;
}

export interface OfertaDeEscuela {
  id: number;
  gradoNombre: string;
  catalogoNombre: string;
  cantidadMaxima: number;
  pedido: {
    id: number;
    libro: LibroAsignado;
    cantidad: number;
    /** Con reclamos no se puede quitar ni cambiar el libro. */
    reclamos: number;
  } | null;
}

export interface PedidosDeEscuela {
  escuela: { id: number; nombre: string; cueanexo: string };
  /** La etapa publicada en la que participa la escuela, o null si no hay. */
  etapa: { id: number; nombre: string } | null;
  ofertas: OfertaDeEscuela[];
}

export interface LibroBuscado {
  id: number;
  titulo: string;
  isbn: string;
  editorial: string;
}

export interface CambioPedido {
  ofertaId: number;
  /** null quita el pedido. */
  libroId: number | null;
  cantidad?: number;
}

export interface ResultadoSincronizacion {
  creados: number;
  actualizados: number;
  reemplazados: number;
  quitados: number;
}

const RECURSO = "pedidos";

export const pedidosQuery = (params: ParametrosPedidos) =>
  queryOptions({
    queryKey: [RECURSO, "listado", params],
    queryFn: () => api<PedidosPaginados>(`/back/pedidos${armarQuery(params)}`),
    placeholderData: keepPreviousData,
  });

export const etapasFiltroQuery = queryOptions({
  queryKey: [RECURSO, "etapas"],
  queryFn: () => api<EtapaFiltro[]>("/back/pedidos/etapas"),
});

/** Dirección de descarga del Excel; el navegador la baja con la cookie de sesión. */
export const urlExportarPedidos = (etapaId: number) =>
  `/api/back/pedidos/exportar/${etapaId}`;

export const pedidosEscuelaQuery = (escuelaId: number) =>
  queryOptions({
    queryKey: [RECURSO, "escuela", escuelaId],
    queryFn: () => api<PedidosDeEscuela>(`/back/escuelas/${escuelaId}/pedidos`),
  });

export const librosDeOfertaQuery = (ofertaId: number, search: string) =>
  queryOptions({
    queryKey: [RECURSO, "libros", ofertaId, search],
    queryFn: () =>
      api<LibroBuscado[]>(
        `/back/ofertas/${ofertaId}/libros${armarQuery({ search })}`,
      ),
    placeholderData: keepPreviousData,
  });

export function useEliminarPedido(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>(`/back/pedidos/${id}`, { metodo: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success("Pedido eliminado correctamente.");
    },
  });
}

/** Guarda todos los cambios de libros de una escuela de una sola vez (todo o nada). */
export function useSincronizarPedidos(escuelaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cambios: CambioPedido[]) =>
      api<ResultadoSincronizacion>(`/back/escuelas/${escuelaId}/pedidos/sync`, {
        metodo: "POST",
        cuerpo: { cambios },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success("Cambios guardados con éxito.");
    },
  });
}
