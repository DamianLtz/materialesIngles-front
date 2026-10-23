import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";
import {
  queryListado,
  type Paginado,
  type ParametrosListado,
} from "@/lib/paginacion";

export interface Grado {
  id: number;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

/** Mismas reglas que valida el back (GuardarGradoDto). */
export const esquemaGrado = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(255, "El nombre no puede superar los 255 caracteres."),
});
export type DatosGrado = z.infer<typeof esquemaGrado>;

const RECURSO = "grados";

export const gradosQuery = (params: ParametrosListado) =>
  queryListado<Grado>(RECURSO, "/back/grados", params);

/** Todos los grados, para los selectores de otros formularios (son pocos: 100 es el máximo del back). */
export const gradosOpcionesQuery = queryOptions({
  queryKey: [RECURSO, "opciones"],
  queryFn: async () =>
    (await api<Paginado<Grado>>(`/back/grados?perPage=100`)).data,
});

/** Alta (sin id) o edición (con id). Los errores los muestra el toast global. */
export function useGuardarGrado(id?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: DatosGrado) =>
      id === undefined
        ? api<Grado>("/back/grados", { metodo: "POST", cuerpo: datos })
        : api<Grado>(`/back/grados/${id}`, { metodo: "PUT", cuerpo: datos }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success(
        id === undefined
          ? "Tipo de grado creado correctamente."
          : "Tipo de grado actualizado correctamente.",
      );
    },
  });
}

export function useEliminarGrado(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>(`/back/grados/${id}`, { metodo: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success("Tipo de grado eliminado correctamente.");
    },
  });
}
