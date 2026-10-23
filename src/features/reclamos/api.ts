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
import type { EstadoReclamo } from "./estados";

export interface ReclamoListado {
  id: number;
  /** "Lote": el id del pedido sobre el que se reclama. */
  pedidoId: number;
  escuela: { id: number; nombre: string; cueanexo: string };
  grado: string;
  catalogo: string;
  libro: { titulo: string; isbn: string };
  tipo: string;
  cantidad: number | null;
  estado: EstadoReclamo;
  createdAt: string;
}

/** El listado devuelve además la etapa que resolvió (la del reclamo abierto si no se pide otra). */
export interface ReclamosPaginados extends Paginado<ReclamoListado> {
  etapaId: number | null;
}

export interface ParametrosReclamos extends ParametrosListado {
  etapaId?: number;
  estado?: EstadoReclamo;
}

export interface EtapaFiltro {
  id: number;
  nombre: string;
  visible: boolean;
}

const RECURSO = "reclamos";

export const reclamosQuery = (params: ParametrosReclamos) =>
  queryOptions({
    queryKey: [RECURSO, "listado", params],
    queryFn: () =>
      api<ReclamosPaginados>(`/back/reclamos${armarQuery(params)}`),
    placeholderData: keepPreviousData,
  });

export const etapasFiltroQuery = queryOptions({
  queryKey: [RECURSO, "etapas"],
  queryFn: () => api<EtapaFiltro[]>("/back/reclamos/etapas"),
});

/** Dirección de descarga del Excel; el navegador la baja con la cookie de sesión. */
export const urlExportarReclamos = (etapaId: number) =>
  `/api/back/reclamos/exportar/${etapaId}`;

/** Cuántos reclamos se archivarían: siempre se pide de nuevo al abrir el aviso. */
export const archivablesQuery = (etapaId: number) =>
  queryOptions({
    queryKey: [RECURSO, "archivables", etapaId],
    queryFn: () =>
      api<{ etapa: { id: number; nombre: string }; archivables: number }>(
        `/back/reclamos/archivar/${etapaId}`,
      ),
    staleTime: 0,
    gcTime: 0,
  });

export function useCambiarEstado(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (estado: EstadoReclamo) =>
      api<{ id: number; estado: EstadoReclamo }>(
        `/back/reclamos/${id}/estado`,
        {
          metodo: "PATCH",
          cuerpo: { estado },
        },
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success("Estado actualizado correctamente.");
    },
  });
}

/** Pasa a histórico todos los reclamos de la etapa. No se puede deshacer. */
export function useArchivar(etapaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api<{ archivados: number }>(`/back/reclamos/archivar/${etapaId}`, {
        metodo: "POST",
      }),
    onSuccess: ({ archivados }) => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success(
        archivados === 1
          ? "Se archivó 1 reclamo."
          : `Se archivaron ${archivados} reclamos.`,
      );
    },
  });
}
