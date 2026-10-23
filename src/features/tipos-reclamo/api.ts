import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";
import { queryListado, type ParametrosListado } from "@/lib/paginacion";

export interface TipoReclamo {
  id: number;
  nombre: string;
  leyenda: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Mismas reglas que valida el back (GuardarTipoReclamoDto). La leyenda es opcional. */
export const esquemaTipoReclamo = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(255, "El nombre no puede superar los 255 caracteres."),
  leyenda: z
    .string()
    .trim()
    .max(1000, "La leyenda no puede superar los 1000 caracteres."),
});
export type DatosTipoReclamo = z.infer<typeof esquemaTipoReclamo>;

const RECURSO = "tipos-reclamo";

export const tiposReclamoQuery = (params: ParametrosListado) =>
  queryListado<TipoReclamo>(RECURSO, "/back/tipos-reclamo", params);

/** Alta (sin id) o edición (con id). Los errores los muestra el toast global. */
export function useGuardarTipoReclamo(id?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: DatosTipoReclamo) =>
      id === undefined
        ? api<TipoReclamo>("/back/tipos-reclamo", {
            metodo: "POST",
            cuerpo: datos,
          })
        : api<TipoReclamo>(`/back/tipos-reclamo/${id}`, {
            metodo: "PUT",
            cuerpo: datos,
          }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success(
        id === undefined
          ? "Tipo de reclamo creado correctamente."
          : "Tipo de reclamo actualizado correctamente.",
      );
    },
  });
}

export function useEliminarTipoReclamo(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api<void>(`/back/tipos-reclamo/${id}`, { metodo: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success("Tipo de reclamo eliminado correctamente.");
    },
  });
}
